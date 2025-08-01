<?php

// namespace App\Security;

// use Symfony\Component\Security\Http\Event\LogoutEvent;
// use Symfony\Component\HttpFoundation\JsonResponse;

// class LogoutSuccessHandler
// {
//     public function onLogoutSuccess(LogoutEvent $event)
//     {
//         // Ex : vider les cookies JWT
//         $response = new JsonResponse(['message' => 'Déconnexion réussie']);
//         $response->headers->clearCookie('JWT_ACCESS_TOKEN');
//         $response->headers->clearCookie('REFRESH_TOKEN');

//         $event->setResponse($response);
//     }
// }
