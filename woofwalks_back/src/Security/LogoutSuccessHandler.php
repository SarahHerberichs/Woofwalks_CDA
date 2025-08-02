<?php

use App\Repository\RefreshTokenRepository;
use Symfony\Component\Security\Core\Security;

class LogoutSuccessHandler
{
    private $refreshTokenRepository;
    private $security;

    public function __construct(RefreshTokenRepository $refreshTokenRepository, Security $security)
    {
        $this->refreshTokenRepository = $refreshTokenRepository;
        $this->security = $security;
    }

    public function onLogoutSuccess(LogoutEvent $event)
    {
        $user = $this->security->getUser();

        if ($user) {
            // Supprimer tous les refresh tokens liés à l'utilisateur
            $this->refreshTokenRepository->deleteAllForUser($user);
        }

        $response = new JsonResponse(['message' => 'Déconnexion réussie']);
        $response->headers->clearCookie('JWT_ACCESS_TOKEN', '/', null, true, true, 'lax');
        $response->headers->clearCookie('REFRESH_TOKEN', '/', null, true, true, 'lax');

        $event->setResponse($response);
    }
}
