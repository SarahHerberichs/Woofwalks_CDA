<?php

namespace App\Tests\Controller;

use App\Controller\WalkController;
use App\Service\WalkCreationService;
use App\Entity\Walk;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;

class WalkControllerTest extends TestCase {

    public function testCreateWalkSuccess() {
        $data = [
            'title' => 'Ma balade',
            'description' => 'Belle balade en forêt',
            'datetime' => '2025-08-16T10:00:00',
            'photo' => 'photo.jpg',
            'location' => 'Parc',
            'is_custom_location' => true
        ];

        $request = new Request([], [], [], [], [], [], json_encode($data));
        //Crée une Walk simulé
        $mockWalk = $this->createMock(Walk::class); 
        //de meme pour WalkCreationService
        $mockService = $this->createMock(WalkCreationService::class);
        $mockService->method('createWalkAndChat')->willReturn($mockWalk);

        $controller = new WalkController();
        $response = $controller->createWalk($request, $mockService);
        //Vérifie que réponse OK
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertStringContainsString('Walk created successfully', $response->getContent());
    }

    public function testCreateWalkMissingFields() {
        $data = [
            'title' => '',
            'description' => '',
        ];

        $request = new Request([], [], [], [], [], [], json_encode($data));

        $mockService = $this->createMock(WalkCreationService::class);

        $controller = new WalkController();
        $response = $controller->createWalk($request, $mockService);

        $this->assertEquals(400, $response->getStatusCode());
        $this->assertStringContainsString('Missing required fields', $response->getContent());
    }

    public function testCreateWalkServiceFails() {
        $data = [
            'title' => 'Balade',
            'description' => 'Desc',
            'datetime' => '2025-08-16T10:00:00',
            'photo' => 'photo.jpg',
            'location' => 'Parc',
            'is_custom_location' => true
        ];

        $request = new Request([], [], [], [], [], [], json_encode($data));

        $mockService = $this->createMock(WalkCreationService::class);
        //Force a retourner null pour être en erreur 400
        $mockService->method('createWalkAndChat')->willReturn(null); 

        $controller = new WalkController();
        $response = $controller->createWalk($request, $mockService);

        $this->assertEquals(400, $response->getStatusCode());
        $this->assertStringContainsString('Failed to create walk', $response->getContent());
    }
}
