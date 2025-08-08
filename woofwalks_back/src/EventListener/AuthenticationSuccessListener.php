<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use App\Entity\RefreshToken;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Uid\Uuid;

class AuthenticationSuccessListener
{
    private $em;
   
    public function __construct(EntityManagerInterface $em, int $refreshTokenTtl)
        {
            $this->em = $em;
            $this->refreshTokenTtl = $refreshTokenTtl;
        }

    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event)
    {
        $user = $event->getUser();
        if (!$user instanceof UserInterface) {
            return;
        }

        // Génération du refresh token (UUID par exemple)
        $newRefreshTokenString = bin2hex(random_bytes(40)); // 80 caractères hexadécimaux aléatoires
        // Création de l'entité RefreshToken
        $refreshToken = new RefreshToken();
        $refreshToken->setRefreshToken($newRefreshTokenString);
        $refreshToken->setUsername($user->getEmail());
        $refreshToken->setValid(new \DateTime('+30 days'));

        // Tu peux gérer date d'expiration etc.

        $this->em->persist($refreshToken);
        $this->em->flush();

        // Récupération de la réponse actuelle
        $data = $event->getData();

        // Ajout du refresh_token dans la réponse JSON
        $data['refresh_token'] = $newRefreshTokenString;

        $event->setData($data);
    }
}
