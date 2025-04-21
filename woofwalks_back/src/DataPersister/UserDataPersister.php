<?php

namespace App\DataPersister;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserDataPersister implements ProcessorInterface
{
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    /**
     * @param User $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
       
        if ($data instanceof User && $data->getPlainPassword()) {
            $hashedPassword = $this->passwordHasher->hashPassword($data, $data->getPlainPassword());
            $data->setPassword($hashedPassword);
            $data->setPlainPassword(null);
        }
    
        $this->entityManager->persist($data);
        $this->entityManager->flush();
    
        return $data;
    }
    
}