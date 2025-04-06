<?php

PHP

    namespace App\Service\Notification;

    use App\Entity\User;

    interface NotificationServiceInterface
    {
        public function send(User $user, string $message): void;
    }

    SmsNotificationService.php :

PHP

    namespace App\Service\Notification;

    use App\Entity\User;

    class SmsNotificationService implements NotificationServiceInterface
    {
        public function send(User $user, string $message): void
        {
            // Logique pour envoyer un SMS
            // utilisation d'un service d'API SMS par exemple.
            dump("SMS à {$user->getPhone()}: {$message}");
        }
    }

    EmailNotificationService.php :

PHP

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

    NotificationManager.php :

PHP

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

    public function notify(User $user, string $event, array $preferences): void
    {
        foreach ($preferences as $preference) {
            if ($preference->getChannel() === 'sms' && $user->getPhone()) {
                $this->smsNotificationService->send($user, $message);
            } elseif ($preference->getChannel() === 'email') {
                $this->emailNotificationService->send($user, $message);
            }
        }
    }

    public function userHasRequestedNotification(User $user, string $event): array
    {
        return $this->entityManager->getRepository(NotificationPreference::class)->findBy(['user' => $user, 'event' => $event]);
    }
}

namespace App\Service\Notification;

use App\Entity\Walk;
use Doctrine\ORM\EntityManagerInterface;

class WalkNotificationService
{
    private $entityManager;
    private $notificationManager;

    public function __construct(EntityManagerInterface $entityManager, NotificationManager $notificationManager)
    {
        $this->entityManager = $entityManager;
        $this->notificationManager = $notificationManager;
    }

    public function notifyWalkParticipants(Walk $walk, string $message): void
    {
        foreach ($walk->getParticipants() as $participant) {
            $preferences = $this->notificationManager->userHasRequestedNotification($participant, 'walk_update');
            if (count($preferences) > 0) {
                $this->notificationManager->notify($participant, 'walk_update', $preferences);
            }
        }
    }
}