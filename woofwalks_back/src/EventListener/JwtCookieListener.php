<?php

namespace App\EventListener;
//Intercepte la réponse de login_check quand symfony prépare la réponse http 
//- récupère le token jwt de la réponse - l'injecte dans un cookie -supprime le token du corps json de la réponse

use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpFoundation\Cookie;

class JwtCookieListener {
    public function onKernelResponse(ResponseEvent $event): void
    {
        error_log('🔍 JwtCookieListener appelé');
        $request = $event->getRequest();

        // Ne traite que les réponses issues de la route /api/login_check
        if (!str_contains($request->getPathInfo(), '/api/login_check')) {
            error_log('⛔ JwtCookieListener ignoré, route incorrecte: ' . $request->getPathInfo());
            return;
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

            // Ajout du cookie à l’en-tête de la réponse HTTP
            $response->headers->setCookie($cookie);

            // Supprime le token du corps de la réponse (pour éviter qu’il soit accessible côté frontend)
            unset($content['token']);

            // Remplace le contenu JSON de la réponse par le nouveau contenu sans le token
            $response->setContent(json_encode($content));
        }
    }
}
