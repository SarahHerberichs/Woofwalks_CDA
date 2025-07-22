<?php

//Lancement du Test Unitaire ./vendor/bin/phpunit tests/Entity/UserTest.php
namespace App\Tests\Entity;

use App\Entity\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    // Test les propriétés de base de l'entité User
    public function testUserBasicProperties()
    {
        $user = new User();

        // Test de la propriété email
        $user->setEmail('test@example.com');
        $this->assertSame('test@example.com', $user->getEmail());
        // getUserIdentifier doit retourner l'email car il sert d'identifiant unique utilisateur
        $this->assertSame('test@example.com', $user->getUserIdentifier());

        // Test du username
        $user->setUsername('username123');
        $this->assertSame('username123', $user->getUsername());

        // Test du password hashé
        $user->setPassword('hashed_password');
        $this->assertSame('hashed_password', $user->getPassword());

        // Test des rôles : on ajoute "ROLE_ADMIN", la méthode getRoles doit toujours inclure aussi "ROLE_USER" par défaut
        $user->setRoles(['ROLE_ADMIN']);
        $roles = $user->getRoles();
        $this->assertContains('ROLE_ADMIN', $roles);  // Role Admin présent?
        $this->assertContains('ROLE_USER', $roles);   // Role User présent? (automatique si tout va bien)

        // Test du champ cgvAccepted 
        $user->setCgvAccepted(true);
        $this->assertTrue($user->isCgvAccepted()); 

        // Test du champ isVerified
        $user->setIsVerified(true);
        $this->assertTrue($user->isVerified()); 

        // Test plainPassword utilisé pour la validation avant hashage
        $user->setPlainPassword('plaintext');
        $this->assertSame('plaintext', $user->getPlainPassword());
    }

    // Test que toutes les collections (relations OneToMany et ManyToMany) sont bien initialisées dans le constructeur
    public function testCollectionsAreInitialized()
    {
        $user = new User();

        // Vérifie que la collection createdWalks est bien un objet Collection de Doctrine
        $this->assertInstanceOf(\Doctrine\Common\Collections\Collection::class, $user->getCreatedWalks());

        // idem avec participatedWalks
        $this->assertInstanceOf(\Doctrine\Common\Collections\Collection::class, $user->getParticipatedWalks());

        // idem avec walkAlertRequests 
        $this->assertInstanceOf(\Doctrine\Common\Collections\Collection::class, $user->getWalkAlertRequests());

        // idem avec channels 
        $this->assertInstanceOf(\Doctrine\Common\Collections\Collection::class, $user->getChannels());

        // idem avec Notifications
        $this->assertInstanceOf(\Doctrine\Common\Collections\Collection::class, $user->getNotifications());
    }
}
