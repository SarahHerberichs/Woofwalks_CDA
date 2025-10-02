<?php

namespace App\Controller;
//Récupération des jwt , création de cookie pour les 2 tokens, suppresion du corps de la reponse
use App\Entity\RefreshToken;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;

class TokenRefreshController extends AbstractController {
    #[Route('/api/token/refresh', name: 'api_token_refresh', methods: ['POST'])]
    public function refresh(
        Request $request,
        EntityManagerInterface $em,
        JWTTokenManagerInterface $jwtManager,
        Security $security
    ): JsonResponse {
        // Le RefreshTokenAuthenticator s'est déjà assuré que l'utilisateur est authentifié.
        $user = $security->getUser();

        if (!$user instanceof User) {
            throw new AuthenticationException('Could not retrieve authenticated user from refresh token.');
        }

        // On récupère le token de rafraîchissement qui a servi à l'authentification
        $refreshTokenValue = $request->cookies->get('REFRESH_TOKEN');

        if (!$refreshTokenValue) {
            // Cette erreur ne devrait pas se produire car l'authenticator l'a déjà vérifiée.
            // On la garde pour une sécurité accrue.
            throw new AuthenticationException('Refresh token cookie not found.');
        }

        // On trouve  RefreshToken en base de données.
        // On s'assure que le token de rafraîchissement correspond bien à l'user
        $refreshTokenEntity = $em->getRepository(RefreshToken::class)->findOneBy([
            'refreshToken' => $refreshTokenValue,
            'username' => $user->getUserIdentifier()
        ]);

        if (!$refreshTokenEntity || $refreshTokenEntity->getValid() < new \DateTimeImmutable()) {
            throw new AuthenticationException('Invalid or expired refresh token.');
        }

        // 1. Génére un nouveau JWT (token d'accès)
        $newJwt = $jwtManager->create($user);

        // 2. Supprime l'ancien refresh token
        $em->remove($refreshTokenEntity);
        $em->flush();

        // 3. Émett un nouveau refresh token
        $newRefreshTokenEntity = new RefreshToken();
        $newRefreshTokenEntity->setRefreshToken(bin2hex(random_bytes(64)));
        $newRefreshTokenEntity->setUsername($user->getUserIdentifier());
        $newRefreshTokenEntity->setValid((new \DateTimeImmutable())->modify('+30 days'));

        $em->persist($newRefreshTokenEntity);
        $em->flush();

        // 4. Prépare la réponse
        $response = $this->json(['message' => 'Token refreshed successfully']);

        // 5. Configure les cookies pour les nouveaux tokens
        $refreshCookie = Cookie::create('REFRESH_TOKEN')
            ->withValue($newRefreshTokenEntity->getRefreshToken())
            ->withHttpOnly(true)
            ->withSecure(true)
            ->withSameSite('lax')
            ->withPath('/')
            ->withExpires(strtotime('+30 days'));

        $jwtCookie = Cookie::create('BEARER')
            ->withValue($newJwt)
            ->withHttpOnly(true)
            ->withSecure(true)
            ->withSameSite('lax')
            ->withPath('/')
            ->withExpires((new \DateTimeImmutable())->modify('+15 minutes')->getTimestamp());


        // 6. Ajouter les cookies à la réponse
        $response->headers->setCookie($refreshCookie);
        $response->headers->setCookie($jwtCookie);

        return $response;
    }
}