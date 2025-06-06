<?php

namespace App\DataPersister;

use App\Entity\User;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Mime\Email;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\EntityManagerInterface;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

//Lors de requete post à api/users
class UserDataPersister implements ProcessorInterface
{
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;
    private MailerInterface $mailer;
    private RouterInterface $router;

    public function __construct(
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        MailerInterface $mailer,
        RouterInterface $router
    )
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
        $this->mailer = $mailer;
        $this->router = $router;
       
    }

    /**
     * @param User $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
       
        if ($data instanceof User && $data->getPlainPassword()) {
            //Gestion du Hashage
            $hashedPassword = $this->passwordHasher->hashPassword($data, $data->getPlainPassword());
            $data->setPassword($hashedPassword);
            $data->setPlainPassword(null);
        
            // Génération token
            $token = Uuid::v4()->toRfc4122();
            $data->setConfirmationToken($token); 
            
            $data->setIsVerified(false); 
    
            $frontendUrl = 'http://localhost:3000'; 
            $confirmationUrl = $frontendUrl . '/confirm-email?token=' . $data->getConfirmationToken();
            // Envoi le mail
            $email = (new Email())
                ->from('admin@terrashare.fr')
                ->to($data->getEmail())
                ->subject('Confirmez votre adresse email')
                ->html("<p>Merci pour votre inscription. Cliquez sur le lien suivant pour confirmer votre adresse : <a href='$confirmationUrl'>Confirmer mon compte</a></p>");

            $this->mailer->send($email);
        }
        
    
        $this->entityManager->persist($data);
        $this->entityManager->flush();
    
        return $data;
    }
    
}