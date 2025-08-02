<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;

use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\ChainTokenExtractor;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\LcobucciJWTEncoder;

class CookieTokenAuthenticator extends AbstractAuthenticator {
    private ChainTokenExtractor $tokenExtractor;
    private LcobucciJWTEncoder $jwtEncoder;
    private UserProviderInterface $userProvider;

    public function __construct(
        ChainTokenExtractor $tokenExtractor,
        LcobucciJWTEncoder $jwtEncoder,
        UserProviderInterface $userProvider
    ) {
        $this->tokenExtractor = $tokenExtractor;
        $this->jwtEncoder = $jwtEncoder;
        $this->userProvider = $userProvider;
    }

    public function supports(Request $request): ?bool {
        $publicPaths = [
            '^/api/confirm-email/',
            '^/api/users$',   
            '^/api/token/refresh',
            '^/api/walks/?$',
            '^/api/parks/?$',
            '^/api/(docs|contexts)',
            '^/$',
        ];

        $path = $request->getPathInfo();
        foreach ($publicPaths as $pattern) {
            if (preg_match("#$pattern#", $path)) {
                error_log("⛔ JwtCookieListener ignoré, route publique : $path");
                return false;
            }
        }

        $hasToken = $request->cookies->has('BEARER');
        if (!$hasToken) {
            error_log('⛔ Pas de cookie BEARER trouvé');
            return false;
        } else {
            error_log('✅ Cookie BEARER présent');
        }

        return true;
    }



    public function authenticate(Request $request): Passport {
        $token = $request->cookies->get('BEARER');
        if (!$token) {
            throw new CustomUserMessageAuthenticationException('Aucun token JWT dans les cookies.');
        }

        try {
            $data = $this->jwtEncoder->decode($token);
            if (!$data) {
                throw new CustomUserMessageAuthenticationException('Token invalide.');
            }
        } catch (\Exception $e) {
            throw new CustomUserMessageAuthenticationException('Token invalide ou mal formé.');
        }

        if (!$data || !isset($data['email'])) {
            throw new CustomUserMessageAuthenticationException('Token JWT invalide ou email absent.');
        }
        //Récupère l'utilisateur complet à partir de son email , charges toutes ses données associées (role, permission...)
        return new SelfValidatingPassport(new UserBadge($data['email'], function ($userIdentifier) {
            return $this->userProvider->loadUserByIdentifier($userIdentifier);
        }));
    }


    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response {
        return null; 
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response {
        return new Response(json_encode(['error' => $exception->getMessage()]), 401, ['Content-Type' => 'application/json']);
    }
}
