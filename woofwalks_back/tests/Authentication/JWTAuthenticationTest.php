<?php

namespace App\Tests\Authentication;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

class JwtAuthenticationTest extends WebTestCase
{
    public function testAccessWithoutToken(): void {
        $client = static::createClient();
        $client->followRedirects(false); 
        $client->request('GET', '/api/me');

        $response = $client->getResponse();
        // Pas de token → redirection vers login
        $this->assertEquals(302, $response->getStatusCode());
    }
     public function testAccessWithValidShortToken(): void {
        $client = static::createClient();
        // Ne suivez pas les redirections pour vérifier la réponse exacte
        $client->followRedirects(false);

        // 1. Récupérer l'utilisateur et générer le token
        $container = static::getContainer();
        $user = $container->get('doctrine')
            ->getRepository(User::class)
            ->findOneBy(['email' => 'test@example.com']);
        
        $this->assertNotNull($user, 'User must exist to run this test');

        $jwtManager = $container->get(JWTTokenManagerInterface::class);
        $token = $jwtManager->create($user);

        $client->request('GET', '/api/me', [], [], [
            'HTTP_HOST' => 'localhost',
            'HTTPS' => 'on',
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
        ]);

        $response = $client->getResponse();
        
        $this->assertEquals(200, $response->getStatusCode());

        $content = json_decode($response->getContent(), true);
        $this->assertEquals($user->getEmail(), $content['email']);
    }




}
