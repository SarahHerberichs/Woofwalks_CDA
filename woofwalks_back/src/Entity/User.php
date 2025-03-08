<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\OneToMany(targetEntity: Walk::class, mappedBy: 'creator')]
    private $createdAds;

    #[ORM\ManyToMany(targetEntity: Walk::class, mappedBy: 'participants')]
    private $participatedWalks;

    public function __construct()
    {
        $this->createdAds = new \Doctrine\Common\Collections\ArrayCollection();
        $this->participatedWalks = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getCreatedAds(): \Doctrine\Common\Collections\Collection
    {
        return $this->createdAds;
    }

    public function getParticipatedWalks(): \Doctrine\Common\Collections\Collection
    {
        return $this->participatedWalks;
    }
}
