<?php

// Déclare le namespace pour que Symfony sache où trouver cette classe
namespace App\EventListener;

// Importe les classes nécessaires à la gestion des événements de réponse HTTP et à la création de cookies
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpFoundation\Cookie;

// Déclare un listener qui interceptera la réponse HTTP juste avant qu'elle ne soit envoyée
class JwtCookieListener
{
    // Cette méthode est automatiquement appelée par Symfony lors de l'événement "kernel.response"
    public function onKernelResponse(ResponseEvent $event): void
    {
        // Journalise que le listener a bien été déclenché (dans le log PHP)
        error_log('🔍 JwtCookieListener appelé');

        // Récupère l'objet Request courant (la requête HTTP)
        $request = $event->getRequest();

        // Ne traite que les réponses issues de la route /api/login_check
        if (!str_contains($request->getPathInfo(), '/api/login_check')) {
            // Log si on ignore cette requête car elle ne concerne pas le login
            error_log('⛔ JwtCookieListener ignoré, route incorrecte: ' . $request->getPathInfo());
            return; // On sort de la fonction si ce n'est pas la bonne route
        }

        // Récupère l'objet Response (la réponse HTTP en cours de construction)
        $response = $event->getResponse();

        // Décode le contenu JSON de la réponse (pour accéder au token)
        $content = json_decode($response->getContent(), true);
        
        // Vérifie si un token JWT est présent dans la réponse
        if (isset($content['token'])) {
            // Log le token reçu (à usage de debug — attention à ne pas faire ça en production)
            error_log('🎯 Token reçu dans JwtCookieListener: ' . $content['token']);

            // Récupère le token JWT
            $token = $content['token'];

            // Crée un cookie nommé "BEARER" contenant le token
            $cookie = Cookie::create('BEARER', $token)
                ->withHttpOnly(true) // Le cookie ne sera pas accessible en JavaScript (sécurité XSS)
                ->withSecure(true)  // Le cookie ne sera pas limité au HTTPS (à mettre à true en prod)
                ->withSameSite('Lax') // Protège un peu contre les attaques CSRF
                ->withPath('/');     // Le cookie sera envoyé pour toutes les requêtes sur le site

            // Ajoute ce cookie à l’en-tête de la réponse HTTP
            $response->headers->setCookie($cookie);

            // Supprime le token du corps de la réponse (pour éviter qu’il soit accessible côté frontend)
            unset($content['token']);

            // Remplace le contenu JSON de la réponse par le nouveau contenu sans le token
            $response->setContent(json_encode($content));
        }
    }
}
