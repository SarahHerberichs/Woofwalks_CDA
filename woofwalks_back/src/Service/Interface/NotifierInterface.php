<?php

namespace App\Service\Interface; // ou App\Service, selon ta structure

interface NotifierInterface
{
    public function send(string $to, string $subjectOrMessage, ?string $message = null): void;
}