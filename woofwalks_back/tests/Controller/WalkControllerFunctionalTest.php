<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

// La classe de test étend WebTestCase, ce qui fournit les outils nécessaires pour les tests fonctionnels Symfony
class WalkControllerFunctionalTest extends WebTestCase
{
    // C'est la méthode de test, le nom commence par 'test' pour être détecté par PHPUnit
    public function testCreateWalkEndpoint()
    {
        // 1. Initialisation du client
        // Crée un client HTTP qui simule un navigateur pour interagir avec l'application.
        $client = static::createClient();
        // Désactive la gestion des exceptions de Symfony pour qu'elles soient levées directement par PHPUnit
        $client->catchExceptions(false);

        // Récupère le conteneur de services de l'application
        $container = static::getContainer();

        // 2. Préparation des données d'authentification
        // Utilise la base de données de test pour trouver le premier utilisateur (créé par les fixtures).
        $user = $container->get('doctrine')->getRepository(User::class)->findOneBy([]);
        // Vérifie que l'utilisateur existe bien pour que le test puisse continuer.
        $this->assertNotNull($user, 'Aucun utilisateur trouvé pour le test');

        // Récupère le service de gestion des tokens JWT pour en générer un.
        $jwtManager = $container->get(JWTTokenManagerInterface::class);
        // Crée le token pour l'utilisateur de test.
        $token = $jwtManager->create($user);
        // S'assure que le token n'est pas vide.
        $this->assertNotEmpty($token, 'Le token JWT est vide');

        // 3. Préparation des données de la requête
        // Le tableau de données que nous allons envoyer dans la requête POST.
        $data = [
            'title' => 'Balade test',
            'description' => 'Description de la balade de test',
            'datetime' => '2025-08-16T10:00:00', // Correspond à la clé attendue par le contrôleur et le service
            'photo' => 2, // L'ID d'une photo qui doit exister dans la base de données de test (via les fixtures)
            'location' => 2, // L'ID d'une localisation qui doit exister dans la base de données de test (via les fixtures)
            'is_custom_location' => true,
            'max_participants' => 10, // Un champ attendu par le service de création
        ];

        // 4. Envoi de la requête HTTP
        // Lance une requête POST vers l'URL de création de balade.
        $client->request(
            'POST',
            '/api/walkscustom',
            [], // Paramètres de requête
            [], // Fichiers
            [
                'HTTP_AUTHORIZATION' => 'Bearer ' . $token, // Envoie le token JWT dans l'en-tête d'autorisation standard
                'CONTENT_TYPE' => 'application/json' // Indique que le corps de la requête est en JSON
            ],
            json_encode($data) // Encode les données en JSON pour le corps de la requête
        );

        // Récupère l'objet de réponse HTTP.
                // ...
            $response = $client->getResponse();
            $responseData = json_decode($response->getContent(), true);

            echo "\nStatus : " . $response->getStatusCode() . "\n";
            echo "Contenu : " . json_encode($responseData, JSON_PRETTY_PRINT) . "\n";

            // Si vous avez un champ 'errors' dans la réponse, affichez-le
            if (isset($responseData['errors'])) {
                echo "Erreurs de validation: \n" . json_encode($responseData['errors'], JSON_PRETTY_PRINT) . "\n";
            }

            $this->assertEquals(201, $response->getStatusCode(), 'Status code incorrect');
            // ...

        // 5. Débogage
        // Ces lignes affichent le statut et le contenu de la réponse pour aider au débogage.
        // C'est grâce à ça que vous avez pu résoudre les erreurs précédentes !
        echo "\nStatus : " . $response->getStatusCode() . "\n";
        echo "Contenu : " . $response->getContent() . "\n";

        // 6. Assertions (Vérifications)
        // Vérifie que le code de statut de la réponse est bien 201 (Créé).
        $this->assertEquals(201, $response->getStatusCode(), 'Status code incorrect');
        // Vérifie que le corps de la réponse contient le message de succès attendu.
        $this->assertStringContainsString('Walk created successfully', $response->getContent(), 'Message attendu non trouvé');
    }
}