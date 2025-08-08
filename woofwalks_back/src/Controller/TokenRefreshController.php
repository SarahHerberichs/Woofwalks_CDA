<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\RefreshToken;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class TokenRefreshController extends AbstractController
{
    #[Route('/api/token/refresh', name: 'api_token_refresh', methods: ['POST'])]
    public function refresh(
        Request $request,
        EntityManagerInterface $em,
        JWTTokenManagerInterface $jwtManager
    ): JsonResponse {
        // 1. Lire le cookie 'BEARER'
        $refreshTokenValue = $request->cookies->get('REFRESH_TOKEN');


        if (!$refreshTokenValue) {
            return $this->json(['message' => 'Missing refresh token'], Response::HTTP_UNAUTHORIZED);
        }

        // 2. Vérifier si le token est en BDD
        $token = $em->getRepository(RefreshToken::class)->findOneBy(['refreshToken' => $refreshTokenValue]);

        if (!$token || $token->getValid() < new \DateTime()) {
            return $this->json(['message' => 'Invalid or expired refresh token'], Response::HTTP_UNAUTHORIZED);
        }

        // 3. Récupérer l’utilisateur
        /** @var User $user */
        $user = $em->getRepository(User::class)->findOneBy(['email' => $token->getUsername()]);

        if (!$user) {
            return $this->json(['message' => 'User not found'], Response::HTTP_UNAUTHORIZED);
        }

        // 4. Générer un nouveau JWT
        $newJwt = $jwtManager->create($user);

        // 5. Si single-use : supprimer le refresh token actuel
        $em->remove($token);
        $em->flush();

        // 6. Émettre un nouveau refresh token (si tu veux en recréer un ici)
        $newRefreshToken = new RefreshToken();
        $newRefreshToken->setRefreshToken(bin2hex(random_bytes(64)));
        $newRefreshToken->setUsername($user->getUserIdentifier());
        $newRefreshToken->setValid((new \DateTime())->modify('+30 days'));

        $em->persist($newRefreshToken);
        $em->flush();

        // 7. Réémettre le cookie sécurisé
        $refreshCookie = Cookie::create('REFRESH_TOKEN')
        ->withValue($newRefreshToken->getRefreshToken())
        ->withHttpOnly(true)
        ->withSecure(true)
        ->withSameSite('lax')
        ->withPath('/')
        ->withExpires(strtotime('+30 days'));

        // 🔥 Cookie du nouveau JWT
    $jwtCookie = Cookie::create('BEARER')
        ->withValue($newJwt)
        ->withHttpOnly(true)
        ->withSecure(true)
        ->withSameSite('lax')
        ->withPath('/')
            ->withExpires((new \DateTime())->modify('+60 seconds')); // correspond au token_ttl de 60s

    $response = $this->json(['message' => 'Token refreshed']);
    $response->headers->setCookie($refreshCookie);
    $response->headers->setCookie($jwtCookie);

    return $response;
    }
}
