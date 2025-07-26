<?php

// namespace App\Security;

// use Symfony\Component\HttpFoundation\JsonResponse;
// use Symfony\Component\HttpFoundation\Request;
// use Symfony\Component\Security\Core\Exception\AuthenticationException;
// use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;

// class AuthenticationFailureHandler implements AuthenticationFailureHandlerInterface
// {
//     public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
//     {
//         return new JsonResponse([
//             'message' => $exception->getMessageKey(),  // ou getMessage()
//         ], JsonResponse::HTTP_UNAUTHORIZED);
//     }
// }


namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;

class AuthenticationFailureHandler implements AuthenticationFailureHandlerInterface
{
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        error_log('AuthenticationFailureHandler called'); // Pour vérifier que ça passe ici
        return new JsonResponse([
            'message' => $exception->getMessageKey(),
        ], JsonResponse::HTTP_UNAUTHORIZED);
    }
}
