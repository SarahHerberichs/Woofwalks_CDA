<?php
// src/DataFixtures/AppFixtures.php

namespace App\DataFixtures;

use App\Entity\MainPhoto;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        // Création d'un objet photo pour la fixture
        $photo = new MainPhoto();
        $photo->setTitle('Test Photo');
        
        // Enregistrer l'entité dans Doctrine
        $manager->persist($photo);

        // Sauvegarder les données dans la base
        $manager->flush();
    }
}
