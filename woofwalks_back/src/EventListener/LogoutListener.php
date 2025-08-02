<?php

namespace App\EventListener;

use Doctrine\ORM\EntityManagerInterface;
use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Symfony\Component\Security\Http\Event\LogoutEvent;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\EventDispatcher\EventSubscriberInterface; // 🚨 AJOUTE CETTE LIGNE !

class LogoutListener implements EventSubscriberInterface // 🚨 MODIFIE LA DÉCLARATION DE LA CLASSE !
{
    private RefreshTokenManagerInterface $refreshTokenManager;
    private EntityManagerInterface $entityManager;

    public function __construct(RefreshTokenManagerInterface $refreshTokenManager, EntityManagerInterface $entityManager)
    {
        $this->refreshTokenManager = $refreshTokenManager;
        $this->entityManager = $entityManager;
    }

    // 🚨 AJOUTE CETTE MÉTHODE !
    public static function getSubscribedEvents(): array
    {
        return [
            LogoutEvent::class => 'onLogout', // Indique que la méthode 'onLogout' doit être appelée pour LogoutEvent
        ];
    }

    public function onLogout(LogoutEvent $event): void
    {
        error_log('===== [LogoutListener] Début onLogout =====');

        $token = $event->getToken();
        if (!$token) {
            error_log('[LogoutListener] Pas de token dans l\'événement logout');
            error_log('===== [LogoutListener] Fin onLogout =====');
            return;
        }
        error_log('[LogoutListener] Token reçu : ' . json_encode($token));

        $user = $token->getUser();
        if (!$user || !is_object($user)) {
            error_log('[LogoutListener] Utilisateur invalide ou absent');
            error_log('===== [LogoutListener] Fin onLogout =====');
            return;
        }

        $username = $user->getUserIdentifier();
        error_log('[LogoutListener] Utilisateur déconnecté : ' . $username);

        // Récupérer le repository de RefreshToken via EntityManager
        $repository = $this->entityManager->getRepository(\Gesdinet\JWTRefreshTokenBundle\Entity\RefreshToken::class);
        $tokens = $repository->findBy(['username' => $username]);

        error_log(sprintf('[LogoutListener] %d refresh tokens trouvés pour l\'utilisateur %s', count($tokens), $username));

        foreach ($tokens as $refreshToken) {
            $tokenValue = method_exists($refreshToken, 'getRefreshToken') ? $refreshToken->getRefreshToken() : 'N/A';
            error_log('[LogoutListener] Suppression token ID: ' . $refreshToken->getId() . ', Token: ' . $tokenValue);
            $this->refreshTokenManager->delete($refreshToken);
        }

        error_log('[LogoutListener] Suppression des tokens de rafraîchissement terminée.');

        $response = $event->getResponse();

        if (!$response) {
            $response = new Response();
            $event->setResponse($response);
            error_log('⚠️ Aucune réponse n\'était présente, une nouvelle réponse a été créée.');
        }

        // Supprime le cookie BEARER
        $response->headers->clearCookie('BEARER', '/', null, true, true, 'lax');
        error_log('🗑️ Cookie BEARER marqué pour suppression.');

        error_log('===== [LogoutListener] Fin onLogout =====');
    }
}