<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Cookie;


class TokenController extends AbstractController
{
    // Le constructeur n'a plus besoin de l'EntityManager ou JWTTokenManagerInterface ici,
    // car la logique sera gérée par les bundles ou d'autres services.
    // Si vous avez d'autres dépendances nécessaires pour d'autres méthodes dans ce contrôleur,
    // vous pouvez les garder, mais assurez-vous qu'elles ne sont pas liées à la gestion des tokens.
    public function __construct()
    {
        // Pas de dépendances injectées ici pour l'instant
    }

  
    public function refresh(Request $request): JsonResponse
    {
        // Cette action est gérée par le firewall 'refresh_jwt' du bundle Gesdinet.
        // Si cette méthode est atteinte, c'est qu'il y a un problème de configuration.
        throw new \LogicException('Cette action est gérée par le firewall Gesdinet JWT Refresh Token.');
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): Response
    {
        $response = new Response();

        // 🚨 C'est la ligne magique dont tu as besoin pour supprimer le cookie BEARER ! 🚨
        $response->headers->clearCookie('BEARER', '/', null, true, true, 'lax'); 
        // Note: J'ai ajouté les paramètres path, domain, secure, httponly et samesite
        // pour m'assurer que les paramètres correspondent EXACTEMENT à ceux avec lesquels le cookie a été créé.
        // C'est crucial pour que le navigateur le supprime correctement.
        // Vérifie les paramètres de ton Cookie::create('BEARER', $token) dans JwtCookieListener
        // et assure-toi qu'ils correspondent ici. Si tu n'as pas spécifié de domaine, null est correct.

        // Symfony Flex met par défaut le path à '/' et secure/httponly à true si tu es en HTTPS.
        // Si tu as utilisé ->withSecure(true) et ->withHttpOnly(true) dans ton JwtCookieListener, 
        // assure-toi de les mettre aussi ici (les deux derniers 'true').
        // 'lax' pour samesite.

        // Tu peux retourner une réponse vide ou un message de succès
        return $response->setStatusCode(Response::HTTP_NO_CONTENT); // 204 No Content est un bon choix pour une déconnexion réussie
    }
}