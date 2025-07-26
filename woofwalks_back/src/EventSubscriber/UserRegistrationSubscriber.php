<?php

namespace App\EventSubscriber;

use App\Entity\User;
use App\Repository\UserRepository; // Importe le UserRepository
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserRegistrationSubscriber implements EventSubscriberInterface
{
    private UserRepository $userRepository;
    private EntityManagerInterface $entityManager;

    public function __construct(UserRepository $userRepository, EntityManagerInterface $entityManager)
    {
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
    }
// va se déclencher apres désérialisation mais avant valiation et persistance
    public static function getSubscribedEvents(): array
    {
        // S'exécute avec une priorité élevée (-100) pour s'assurer qu'il est après les autres subscribers
        // mais avant la validation standard d'ApiPlatform.
        return [
            KernelEvents::VIEW => ['onPreRegisterUser', 200],                       
        ];
    }

    public function onPreRegisterUser(ViewEvent $event): void
    {
        $user = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        // On s'intéresse uniquement aux requêtes POST sur l'entité User (pour l'inscription)
        if (!$user instanceof User || $method !== 'POST') {
            return;
        }

        // Récupère l'e-mail du nouvel utilisateur qui tente de s'inscrire
        $email = $user->getEmail();
        if (empty($email)) {
            // L'email ne devrait pas être vide si on arrive ici normalement mais controle quand meme
            return;
        }

        // Recherche un utilisateur existant avec cet e-mail
        $existingUser = $this->userRepository->findOneBy(['email' => $email]);

        if ($existingUser) {
            // Définit la limite de temps pour l'expiration (24 heures)
            $expirationTime = (new \DateTimeImmutable())->modify('-24 hours');

            // Vérifie si l'utilisateur existant n'est pas vérifié ET que son lien de confirmation est expiré
            if (!$existingUser->isVerified() && 
                $existingUser->getConfirmationRequestedAt() !== null && 
                $existingUser->getConfirmationRequestedAt() < $expirationTime) {
                
                // --- LOGIQUE DE SUPPRESSION ---
                $this->entityManager->remove($existingUser);
                $this->entityManager->flush(); // Exécute la suppression immédiatement

                return; 
            } else {
                // Si l'utilisateur existant est vérifié OU non vérifié mais non expiré, on bloque la nouvelle inscriptiuon
                // La contrainte #[UniqueEntity] se chargera de générer le bon message d'erreur
                return;
            }
        }
        // Si aucun utilisateur existant avec cet email n'est trouvé,
        // le nouveau $user sera traité normalement par le DataPersister.
    }
}