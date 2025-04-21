<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RegistrationController extends AbstractController
{
    // #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    // public function register(
    //     Request $request,
    //     EntityManagerInterface $entityManager,
    //     UserPasswordHasherInterface $passwordHasher,
    //     ValidatorInterface $validator
    // ): JsonResponse {
    //     $data = json_decode($request->getContent(), true);

    //     $user = new User();
    //     $user->setEmail($data['email'] ?? '');
    //     $user->setPassword($data['password'] ?? '');

    //     $errors = $validator->validate($user, null, ['user:write']);

    //     if (count($errors) > 0) {
    //         $errorMessages = [];
    //         foreach ($errors as $error) {
    //             $errorMessages[$error->getPropertyPath()] = $error->getMessage();
    //         }
    //         return new JsonResponse(['errors' => $errorMessages], 400);
    //     }

    //     // Hash the password
    //     $hashedPassword = $passwordHasher->hashPassword($user, $user->getPassword());
    //     $user->setPassword($hashedPassword);

    //     $entityManager->persist($user);
    //     $entityManager->flush();

    //     return new JsonResponse(['message' => 'User registered successfully'], 201);
    // }
}