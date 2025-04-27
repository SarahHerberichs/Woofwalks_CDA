<?php

namespace App\Service;

use App\Entity\Chat;
use App\Entity\User;
use App\Entity\Walk;
use App\Repository\LocationRepository;
use App\Repository\PhotoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

class WalkCreationService
{
    private EntityManagerInterface $entityManager;
    private PhotoRepository $photoRepository;
    private LocationRepository $locationRepository;
    private Security $security;

    public function __construct(EntityManagerInterface $entityManager, PhotoRepository $photoRepository, LocationRepository $locationRepository, Security $security)
    {
        $this->entityManager = $entityManager;
        $this->photoRepository = $photoRepository;
        $this->locationRepository = $locationRepository;
        $this->security = $security;
    }

    public function createWalkAndChat(array $data): ?Walk
    {
        //Vérifications
        if (
            empty($data['title']) ||
            empty($data['description']) ||
            empty($data['date']) ||
            empty($data['photo']) ||
            empty($data['location'])
        ) {
            return null; 
        }

        try {
            $datetime = new \DateTime($data['datetime']);
        } catch (\Exception $e) {
            return null; 
        }

        $photo = $this->photoRepository->find($data['photo']);
        if (!$photo) {
            return null; 
        }
   
        $location = $this->locationRepository->find($data['location']);

        $creator = $this->security->getUser();
  
        if (!$creator instanceof User) {
            return null; 
        }

        $walk = new Walk();
        $walk->setTitle($data['title']);
        $walk->setDescription($data['description']);
        $walk->setMainPhoto($photo);
        $walk->setDate($datetime);
        $walk->setMaxParticipants($data['max_participants'] ?? 0); 
        $walk->setCustomLocation($location);
        $walk->setCreator($creator);

        $chat = new Chat();
        $chat->setWalk($walk);

        $this->entityManager->persist($walk);
        $this->entityManager->persist($chat);
        $this->entityManager->flush();

        return $walk;
    }
}