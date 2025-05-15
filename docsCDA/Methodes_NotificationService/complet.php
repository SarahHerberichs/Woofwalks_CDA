<?php

PHP

    namespace App\Service\Notification;

    use App\Entity\User;

    //Services de Notif Sms et Mail l'utilisent
    interface NotificationServiceInterface
    {
        public function send(User $user, string $message): void;
    }


    namespace App\Service\Notification;

    use App\Entity\User;

    class SmsNotificationService implements NotificationServiceInterface
    {
        public function send(User $user, string $message): void
        {
            // Logique pour envoyer un SMS
            dump("SMS à {$user->getPhone()}: {$message}");
        }
    }


    namespace App\Service\Notification;

    use App\Entity\User;
    use Symfony\Component\Mailer\MailerInterface;
    use Symfony\Component\Mime\Email;

    class EmailNotificationService implements NotificationServiceInterface
    {
        private $mailer;

        public function __construct(MailerInterface $mailer)
        {
            $this->mailer = $mailer;
        }

        public function send(User $user, string $message): void
        {
            $email = (new Email())
                ->from('sender@example.com')
                ->to($user->getEmail())
                ->subject('Notification')
                ->text($message);

            $this->mailer->send($email);
        }
    }

namespace App\Entity;

class NotificationEvent
{
    private int $id;
    private string $code;

    public function getCode(): string { return $this->code; }
}

class UserNotificationEvent
{
    private int $id;
    private User $user;
    private NotificationEvent $event;
    private string $channel;

    public function getUser(): User { return $this->user; }
    public function getEvent(): NotificationEvent { return $this->event; }
    public function getChannel(): string { return $this->channel; }
}

    namespace App\Service\Notification;

    use App\Entity\User;
    use Doctrine\ORM\EntityManagerInterface;

    class NotificationManager
{
    private $entityManager;
    private $smsNotificationService;
    private $emailNotificationService;

    public function __construct(EntityManagerInterface $entityManager, SmsNotificationService $smsNotificationService, EmailNotificationService $emailNotificationService)
    {
        $this->entityManager = $entityManager;
        $this->smsNotificationService = $smsNotificationService;
        $this->emailNotificationService = $emailNotificationService;
    }

    public function notify(User $user, string $eventCode, string $message): void
    {
        $preferences = $this->getUserNotificationPreferences($user, $eventCode);
        foreach ($preferences as $preference) {
            if ($preference->getChannel() === 'sms' && $user->getPhone()) {
                $this->smsNotificationService->send($user, $message);
            } elseif ($preference->getChannel() === 'email') {
                $this->emailNotificationService->send($user, $message);
            }
        }
    }
    public function getUserNotificationPreferences(User $user, string $eventCode): array
    {
        return $this->entityManager
            ->getRepository(UserNotificationEvent::class)
            ->createQueryBuilder('une')
            ->join('une.event', 'e')
            ->where('une.user = :user')
            ->andWhere('e.code = :code')
            ->setParameters([
                'user' => $user,
                'code' => $eventCode
            ])
            ->getQuery()
            ->getResult();
    }

    // public function userHasRequestedNotification(User $user, string $event): array
    // {
    //     return $this->entityManager->getRepository(NotificationPreference::class)->findBy(['user' => $user, 'event' => $event]);
    // }
}

namespace App\Service\Notification;

use App\Entity\Walk;
use Doctrine\ORM\EntityManagerInterface;

class WalkNotificationService
{
    private $notificationManager;

    public function __construct( NotificationManager $notificationManager)
    {
        $this->notificationManager = $notificationManager;
    }

    //Cherche les participants de la walk et pour chacun verifie s'il a une demande de notif(renvoi un tableau contenant sa ou ses preferences (sms ou mail)
    // si oui : methode notify du manager
    //Qui attend le participant, le type d'evenement et ses preferences 
 public function notifyWalkParticipants(Walk $walk, string $message): void
{
    $eventCode = 'walk_update';

    foreach ($walk->getParticipants() as $participant) {
        $preferences = $this->notificationManager->getUserNotificationPreferences($participant, $eventCode);

        if (count($preferences) > 0) {
            $this->notificationManager->notify($participant, $eventCode, $message);
        }
    }
}

}