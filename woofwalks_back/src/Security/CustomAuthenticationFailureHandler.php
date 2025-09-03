<?php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Security\Http\Authentication\AuthenticationFailureHandler;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class CustomAuthenticationFailureHandler extends AuthenticationFailureHandler
{
    private RateLimiterFactory $loginLimiter;

    public function __construct(
        EventDispatcherInterface $dispatcher,
        ?TranslatorInterface $translator,
        JWTManagerInterface $jwtManager,
        LoggerInterface $logger,
        RateLimiterFactory $loginLimiter
    ) {
        // Le parent constructeur est appelé avec les arguments corrects.
        parent::__construct($dispatcher, $translator, $jwtManager, $logger);
        $this->loginLimiter = $loginLimiter;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
        $limiter = $this->loginLimiter->create($request->getClientIp());
        
        // Consomme un jeton et vérifie si la consommation a été acceptée en une seule ligne.
        if (!$limiter->consume()->isAccepted()) {
            return new Response('Trop de tentatives de connexion, veuillez réessayer plus tard.', Response::HTTP_TOO_MANY_REQUESTS);
        }

        // Si la limite n'est pas atteinte, on retourne la réponse par défaut.
        return parent::onAuthenticationFailure($request, $exception);
    }
}
