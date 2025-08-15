<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Création d'un utilisateur de test
        $user = new User();
        $user->setUserName('roudoudou');
        $user->setEmail('test@example.com');
        $user->setRoles(['ROLE_USER']);
        $user->setCgvAccepted(true);
        $user->setIsVerified(true);
        
        // Hacher le mot de passe
        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            'password'
        );
        $user->setPassword($hashedPassword);

        // Enregistrer l'utilisateur
        $manager->persist($user);
        $manager->flush();
    }
}