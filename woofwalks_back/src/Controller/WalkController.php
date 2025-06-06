<?php

namespace App\Controller;

use App\Service\WalkCreationService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class WalkController extends AbstractController
{
    #[Route('/api/walkscustom', name: 'create_walk', methods: ['POST'])]
    public function createWalk(Request $request, WalkCreationService $walkCreationService): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
  
        // Validation basique dans le contrôleur (peut être améliorée avec des Formulaires Symfony)
        if (
            empty($data['title']) ||
            empty($data['description']) ||
            empty($data['datetime']) ||
            empty($data['photo']) || 
            empty($data['location']) ||
           !isset($data['is_custom_location']) || // Vérifie si la clé existe
        !is_bool($data['is_custom_location'])
        ) {
            return new JsonResponse(['error' => 'Missing required fields'], 400);
        }

        $walk = $walkCreationService->createWalkAndChat($data);

        if (!$walk) {
            return new JsonResponse(['error' => 'Failed to create walk (invalid data or dependencies)'], 400);
        }

        return new JsonResponse(['message' => 'Walk created successfully'], 201);
    }
}