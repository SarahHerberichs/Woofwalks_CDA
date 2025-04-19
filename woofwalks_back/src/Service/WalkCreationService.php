<?php

namespace App\Service;

use App\Entity\Chat;
use App\Entity\User;
use App\Entity\Walk;
use App\Repository\PhotoRepository;
use Doctrine\ORM\EntityManagerInterface;

class WalkCreationService
{
    private EntityManagerInterface $entityManager;
    private PhotoRepository $photoRepository;

    public function __construct(EntityManagerInterface $entityManager, PhotoRepository $photoRepository)
    {
        $this->entityManager = $entityManager;
        $this->photoRepository = $photoRepository;
    }

    public function createWalkAndChat(array $data, int $creatorId): ?Walk
    {
        if (
            empty($data['title']) ||
            empty($data['description']) ||
            empty($data['date']) ||
            empty($data['photo'])
        ) {
            return null; // Ou lancer une exception
        }

        try {
            $datetime = new \DateTime($data['datetime']);
        } catch (\Exception $e) {
            return null; // Ou lancer une exception
        }

        $photo = $this->photoRepository->find($data['photo']);
        if (!$photo) {
            return null; // Ou lancer une exception
        }

        $creator = $this->entityManager->getRepository(User::class)->find($creatorId);
        if (!$creator) {
            return null; // Ou lancer une exception
        }

        $walk = new Walk();
        $walk->setTitle($data['title']);
        $walk->setDescription($data['description']);
        $walk->setMainPhoto($photo);
        $walk->setDate($datetime);
        $walk->setMaxParticipants($data['max_participants'] ?? 0); // Utiliser une valeur par défaut si non fourni
        $walk->setCreator($creator);

        $chat = new Chat();
        $chat->setWalk($walk);

        $this->entityManager->persist($walk);
        $this->entityManager->persist($chat);
        $this->entityManager->flush();

        return $walk;
    }
}