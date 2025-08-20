<?php

namespace App\Service;

use App\Entity\Walk;

interface WalkCreationServiceInterface
{
    public function createWalkAndChat(array $data): ?Walk;
}
