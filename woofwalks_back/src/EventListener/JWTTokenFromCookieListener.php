<?php
//Avant traitement des requetes entrentes, vérifie si header authorization est présent dans la requete, récupère le token, l'ajoute à authorisation  

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;

class JWTTokenFromCookieListener
{
    public function onKernelRequest(RequestEvent $event)
    {
        $request = $event->getRequest();

        // Si on a déjà un header Authorization, on ne touche pas
        if ($request->headers->has('Authorization')) {
            return;
        }

        // Récupère le cookie BEARER
        $token = $request->cookies->get('BEARER');
         error_log('Token from cookie: ' . ($token ?? 'NULL'));
        if ($token) {
            // Injecte dans le header Authorization
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }
    }
}
