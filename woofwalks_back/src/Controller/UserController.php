<?php
//Apellée pour avoir les détails de l'user à partir du token envoyé dans la requete
//Apellée par lAuthProvider pour :
// 1.vérif si user est connecté au chargement de la page
// 2. vérif apr_s refresh du token pour vérifier que le nouveau token est valide et que user est toujours connecté
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface; 
use Symfony\Component\Validator\Validator\ValidatorInterface; 

use Doctrine\ORM\EntityManagerInterface;

class UserController extends AbstractController {

    #[Route('/api/me', name: 'api_me', methods: ['GET', 'PATCH'])]
    public function me(Request $request, Security $security, EntityManagerInterface $entityManager): JsonResponse {
        $user = $security->getUser();

        if (!$user) {
            return new JsonResponse(['message' => 'Unauthorized'], 401);
        }

        $emailChanged = false;
        $requiresLogout = false;

        if ($request->isMethod('PATCH')) {
            $data = json_decode($request->getContent(), true);
            
            if (isset($data['username']) && $user->getUsername() !== $data['username']) {
                $user->setUsername($data['username']);
            }

            if (isset($data['email']) && $user->getEmail() !== $data['email']) {
                $user->setEmail($data['email']);
                $emailChanged = true;
                $requiresLogout = true;
            }
            if (isset($data['acceptNotifications']) && $user->getAcceptNotifications() !== $data['acceptNotifications']) {
                $user->setAcceptNotifications((bool) $data['acceptNotifications']); 
            }
            $entityManager->persist($user);
            $entityManager->flush();
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'acceptNotifications' => $user->getAcceptNotifications(),
            'emailChanged' => $emailChanged,  
            'requiresLogout' => $emailChanged  
        ]);
    }

#[Route('/api/change-password', name: 'api_change_password', methods: ['POST'])]
public function changePassword(
    Request $request, 
    Security $security, 
    EntityManagerInterface $entityManager,
    UserPasswordHasherInterface $passwordHasher,
    ValidatorInterface $validator
): JsonResponse {
    $user = $security->getUser();
    
    if (!$user) {
        return new JsonResponse(['error' => 'Non authentifié'], 401);
    }

    $data = json_decode($request->getContent(), true);
    
    if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
        return new JsonResponse(['error' => 'Mot de passe actuel et nouveau mot de passe requis'], 400);
    }

    if (!$passwordHasher->isPasswordValid($user, $data['currentPassword'])) {
        return new JsonResponse(['error' => 'Mot de passe actuel incorrect'], 400);
    }

    // Validation simple côté serveur
    if (strlen($data['newPassword']) < 6) {
        return new JsonResponse(['error' => 'Le mot de passe doit contenir au moins 6 caractères'], 400);
    }

    // Définir le mot de passe en clair pour la validation
    $user->setPlainPassword($data['newPassword']);
    
    // Valider le mot de passe avec les mêmes règles que la création de compte
    $errors = $validator->validate($user, null, ['user:write']);
    
    if (count($errors) > 0) {
        $errorMessages = [];
        foreach ($errors as $error) {
            $errorMessages[] = $error->getMessage();
        }
        
        // Retourner la première erreur directement
        return new JsonResponse(['error' => $errorMessages[0]], 400);
    }

    // Si validation OK, hasher et sauvegarder
    $hashedPassword = $passwordHasher->hashPassword($user, $data['newPassword']);
    $user->setPassword($hashedPassword);
    $user->setPlainPassword(null);

    $entityManager->persist($user);
    $entityManager->flush();

    return new JsonResponse(['message' => 'Mot de passe modifié avec succès']);
}
}