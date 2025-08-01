<?php


namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route; // Très important !
//Controlleur qui ne sert qu'à déclarer la route
class AuthController extends AbstractController
{
    /**
     * @Route("/api/login_check", name="api_login_check", methods={"POST"})
     * // PHP 8+ Attribute: #[Route("/api/login_check", name: "api_login_check", methods: ["POST"])]
     *
     * Cette méthode est UNIQUEMENT une DÉCLARATION de route pour Symfony.
     * La logique d'authentification pour cette route est entièrement gérée par le bundle Lexik JWT Authentication.
     * Vous n'avez PAS de code métier à écrire ici.
     */
    public function loginCheck(): JsonResponse
    {
        // Cette ligne est une mesure de sécurité. Si par un cas rare le bundle n'intercepte pas la requête,
        // cette erreur sera levée au lieu d'un comportement inattendu.
        throw new \LogicException('Cette action est gérée par le firewall Lexik JWT Authentication.');
    }

    // Vous pouvez ajouter ici d'autres routes liées à l'authentification si vous en avez,
    // par exemple pour l'enregistrement d'utilisateurs, la confirmation d'email, etc.
}