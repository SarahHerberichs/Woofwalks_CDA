
1. ✅ Walk modifiée

#[AsEntityListener(event: Events::postUpdate, entity: Walk::class)]
class WalkUpdateListener
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    public function postUpdate(Walk $walk, LifecycleEventArgs $args): void
    {
        foreach ($walk->getParticipants() as $user) {
            $this->notificationService->createAndDispatchNotification(
                $user,
                'walk_update',
                ['walk' => $walk]
            );
        }
    }
}

2. ✅ Nouveau Feedback posté

#[AsEntityListener(event: Events::postPersist, entity: Feedback::class)]
class FeedbackListener
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    public function postPersist(Feedback $feedback, LifecycleEventArgs $args): void
    {
        $walk = $feedback->getWalk();

        foreach ($walk->getParticipants() as $user) {
            $this->notificationService->createAndDispatchNotification(
                $user,
                'new_feedback',
                ['walk' => $walk]
            );
        }
    }
}

3. ✅ Nouveau Message dans un Chat lié à une Walk

#[AsEntityListener(event: Events::postPersist, entity: MessageChat::class)]
class MessageChatListener
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    public function postPersist(MessageChat $message, LifecycleEventArgs $args): void
    {
        $chat = $message->getChat();
        $walk = $chat->getWalk();

        foreach ($walk->getParticipants() as $user) {
            // Ne pas notifier l'expéditeur
            if ($user !== $message->getSender()) {
                $this->notificationService->createAndDispatchNotification(
                    $user,
                    'new_message',
                    [
                        'walk' => $walk,
                        'sender' => $message->getSender(),
                    ]
                );
            }
        }
    }
}

🔔 NotificationService

class NotificationService
{
    public function __construct(
        private EntityManagerInterface $em,
        private MessageBuilder $messageBuilder,
        private EmailService $emailService,
        private SmsService $smsService
    ) {}

    public function createAndDispatchNotification(User $user, string $typeCode, array $context): void
    {
        $type = $this->em->getRepository(NotificationType::class)->findOneBy(['code' => $typeCode]);

        if (!$type) {
            throw new \LogicException("NotificationType $typeCode not found");
        }

        foreach ($user->getChannelUsers() as $channelUser) {
            $notif = new Notification();
            $notif->setChannelUser($channelUser);
            $notif->setType($type);
            $notif->setCreatedAt(new \DateTime());
            $notif->setContext($context); // Assume a JSON or serialized field

            $this->em->persist($notif);
            $this->sendNotification($notif);
        }

        $this->em->flush();
    }

    private function sendNotification(Notification $notification): void
    {
        $channel = $notification->getChannelUser()->getChannel()->getName();
        $user = $notification->getChannelUser()->getUser();

        $message = $this->messageBuilder->build($notification);

        if ($channel === 'email') {
            $this->emailService->send($user->getEmail(), $notification->getType()->getSubjectEmail(), $message);
        } elseif ($channel === 'sms') {
            $this->smsService->send($user->getPhoneNumber(), $message);
        }
    }
}

🧠 MessageBuilder (personnalise les messages)

class MessageBuilder
{
    public function build(Notification $notification): string
    {
        $type = $notification->getType()->getCode();
        $context = $notification->getContext(); // tableau associatif

        return match ($type) {
            'walk_update'  => "La walk « " . $context['walk']->getTitle() . " » a été modifiée.",
            'new_feedback' => "Un nouveau feedback a été posté sur la walk « " . $context['walk']->getTitle() . " ».",
            'new_message'  => "Nouveau message de " . $context['sender']->getUsername() . " dans la walk « " . $context['walk']->getTitle() . " ».",
            default        => "Vous avez une nouvelle notification.",
        };
    }
}
interface NotifierInterface
{
    public function send(string $to, string $subjectOrMessage, ?string $message = null): void;
}

class SmsService implements NotifierInterface
{
    public function send(string $to, string $subjectOrMessage, ?string $message = null): void
    {
        // Envoi SMS via API externe
        // $to => numéro de téléphone
        // $subjectOrMessage => contenu du SMS
        // $message est ignoré
    }
}