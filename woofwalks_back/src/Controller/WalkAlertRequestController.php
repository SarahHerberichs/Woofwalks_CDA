<?php

namespace App\Controller;

use App\Entity\WalkAlertRequest;
use App\Entity\User;
use App\Entity\Walk;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class WalkAlertRequestController extends AbstractController {
    public function __construct(
        private EntityManagerInterface $entityManager,
        private EmailService $emailService
    ) {}

    #[Route('/api/walk_alert_requests', name: 'create_walk_alert_request', methods: ['POST'])]
    public function create(Request $request): JsonResponse {
        $user = $this->getUser();
        
        if (!$user) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['walk'])) {
            return new JsonResponse(['error' => 'Walk requis'], 400);
        }

        // Extraire l'ID de la balade depuis l'IRI
        $walkId = $this->extractIdFromIri($data['walk']);
        if (!$walkId) {
            return new JsonResponse(['error' => 'IRI de balade invalide'], 400);
        }

        // Récupération de la Walk
        $walk = $this->entityManager->getRepository(Walk::class)->find($walkId);
        if (!$walk) {
            return new JsonResponse(['error' => 'Balade non trouvée'], 404);
        }

        // Création de la demande d'alerte
        $alertRequest = new WalkAlertRequest();
        $alertRequest->setUser($user);
        $alertRequest->setWalk($walk);
        $alertRequest->setRequestedAt(new \DateTime());
        $alertRequest->setNotified(false);

        $this->entityManager->persist($alertRequest);
        $this->entityManager->flush();

        try {
            $this->sendAlertEmail($user, $walk);
        } catch (\Exception $e) {
            error_log('Erreur envoi email alerte: ' . $e->getMessage());
        }

        return new JsonResponse([
            'message' => 'Demande d\'alerte créée avec succès',
            'id' => $alertRequest->getId()
        ], 201);
    }

    private function extractIdFromIri(string $iri): ?int {
        // Extraction de l'ID depuis "/api/walks/123"
        if (preg_match('/\/api\/walks\/(\d+)$/', $iri, $matches)) {
            return (int) $matches[1];
        }
        return null;
    }

    private function sendAlertEmail(User $user, Walk $walk): void {
        
        $subject = 'Demande d\'alerte enregistrée - ' . $walk->getTitle();
      $htmlContent = $this->renderView('walk_alert_request.html.twig', [
            'user' => $user,
            'walk' => $walk
        ]);

        $this->emailService->send($user->getEmail(), $subject, $htmlContent);
    }
}
