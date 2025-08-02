<?php


namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route; // Très important !
//Controlleur qui ne sert qu'à déclarer la route
class AuthController extends AbstractController
{
    /**
     *[Route("/api/login_check", name: "api_login_check", methods: ["POST"])]
     *
     * Cette méthode est UNIQUEMENT une DÉCLARATION de route pour Symfony.
     * La logique d'authentification pour cette route est entièrement gérée par le bundle Lexik JWT Authentication.
     */
    public function loginCheck(): JsonResponse
    {

        throw new \LogicException('Cette action est gérée par le firewall Lexik JWT Authentication.');
    }

}