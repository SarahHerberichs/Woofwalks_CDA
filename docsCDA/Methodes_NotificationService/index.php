<?php

//Appel si MessageChat :

public function createMessage(Message $message, WalkRelatedNotificationService $walkRelatedNotificationService): Response
{
    // ... Logique de création du message

    $walk = $message->getChat()->getWalk();
    $walkRelatedNotificationService->notifyWalkParticipants($walk, 'chat_message_posted', 'Nouveau message dans le chat.');

    // ...
}

//Appel si feedback 

public function createFeedback(Feedback $feedback, WalkRelatedNotificationService $walkRelatedNotificationService): Response
{
    // ... Logique de création du feedback

    $walk = $feedback->getWalk();
    $walkRelatedNotificationService->notifyWalkParticipants($walk, 'feedback_posted', 'Nouveau feedback.');

    // ...
}
// Appel si updateWalk
public function updateWalk(Walk $walk, WalkRelatedNotificationService $walkRelatedNotificationService): Response
    {
        // ... Logique de mise à jour de la Walk

        $walkRelatedNotificationService->notifyWalkParticipants($walk, 'walk_update', 'La Walk a été mise à jour.');

        // ...
    }

//WALKRELATEDNOTIFICATIONSERVICE
public function notifyWalkParticipants(Walk $walk, string $message): void
        {
            foreach ($walk->getParticipants() as $participant) {
                //User veut des notifs si l'évent est walk_update? Si oui, on passe à methode notify le participant, l'event et le message
                if ($this->notificationManager->userHasRequestedNotification($participant, 'walk_update')) {
                    $this->notificationManager->notify($participant, 'walk_update', $message);
                }
            }
        }

//NOTIFICATIONMANAGER

public function userHasRequestedNotification(User $user, string $event): bool
        {
            //Cherche si l'utilisateur à demandé notification sur cet event et retourne vrai ou faux
            $preferences = $this->entityManager->getRepository(NotificationPreference::class)->findBy(['user' => $user, 'event' => $event]);

            if (count($preferences) > 0) {
                return true;
            }

            return false;
        }
        public function notify(User $user, string $event, string $message): void
        {
            //Récupere l'event ayant déclenché l'envoi de notif(dont on sait déjà que l'utilisateur a demandé ) et appel au sms et ou email service
            $preferences = $this->entityManager->getRepository(NotificationPreference::class)->findBy(['user' => $user, 'event' => $event]);

            foreach ($preferences as $preference) {
                if ($preference->getChannel() === 'sms' && $user->getPhone()) {
                    $this->smsNotificationService->send($user, $message);
                } elseif ($preference->getChannel() === 'email') {
                    $this->emailNotificationService->send($user, $message);
                }
            }
        }

        //Email OU SMS Notif service
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

    //SMS

    class SmsNotificationService implements NotificationServiceInterface
    {
        public function send(User $user, string $message): void
        {
            // Logique pour envoyer un SMS
            // utilisation d'un service d'API SMS par exemple.
            dump("SMS à {$user->getPhone()}: {$message}");
        }
    }

 //INTERFACE

    interface NotificationServiceInterface
    {
        public function send(User $user, string $message): void;
    }