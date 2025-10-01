<?php
namespace App\Service;

use App\Service\Contract\NotifierInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class EmailService implements NotifierInterface {
    public function __construct(
        private MailerInterface $mailer
    ) {}

    public function send(string $to, string $subjectOrMessage, ?string $message = null): void {

        $subject = $message ? $subjectOrMessage : 'Notification WoofWalks';
        $body = $message ?: $subjectOrMessage;

        $email = (new Email())
            ->from('admin@terrashare.fr')  
            ->to($to)
            ->subject($subject)
            ->html($body);

        $this->mailer->send($email);
    }
}