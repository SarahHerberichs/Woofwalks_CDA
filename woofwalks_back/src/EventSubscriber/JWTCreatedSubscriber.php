<?php

namespace App\EventSubscriber;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Psr\Log\LoggerInterface; // Importez l'interface du logger

class JWTCreatedSubscriber implements EventSubscriberInterface
{
    private $logger;

    // Injectez le logger via le constructeur
    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $this->logger->info('JWTCreatedSubscriber: Événement onJWTCreated déclenché.');

        /** @var UserInterface $user */
        $user = $event->getUser();

        if ($user instanceof UserInterface) { // Assurez-vous que c'est bien un objet User
            $this->logger->info('JWTCreatedSubscriber: Utilisateur trouvé avec username/email: ' . $user->getUserIdentifier());

            if (method_exists($user, 'getId')) {
                $payload = $event->getData();
                $this->logger->info('JWTCreatedSubscriber: Payload original: ' . json_encode($payload));

                $payload['id'] = $user->getId(); // Ajout de l'ID au payload
                $this->logger->info('JWTCreatedSubscriber: ID utilisateur ajouté: ' . $user->getId());

                $event->setData($payload);
                $this->logger->info('JWTCreatedSubscriber: Nouveau payload défini: ' . json_encode($event->getData()));
            } else {
                $this->logger->warning("JWTCreatedSubscriber: L'objet utilisateur n'a PAS de méthode getId(). Type: " . get_class($user));
            }
        } else {
            $this->logger->warning('JWTCreatedSubscriber: L\'objet utilisateur n\'est pas une instance de UserInterface. Type: ' . get_class($user));
        }
    }

    public static function getSubscribedEvents()
    {
        return [
            'lexik_jwt_authentication.on_jwt_created' => 'onJWTCreated',
        ];
    }
}