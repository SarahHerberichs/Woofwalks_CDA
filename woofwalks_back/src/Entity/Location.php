<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\LocationRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    normalizationContext: ['groups' => ['location:read']],
    denormalizationContext: ['groups' => ['location:write']],
)]
#[ORM\Entity(repositoryClass: LocationRepository::class)]
class Location
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: 'float')]
    #[Groups(['location:read', 'location:write', 'walk:read'])]
    private ?float $latitude = null;

    #[ORM\Column(type: 'float')]
    #[Groups(['location:read', 'location:write', 'walk:read'])]
    private ?float $longitude = null;

    #[ORM\OneToOne(mappedBy: 'location', targetEntity: Park::class, cascade: ['persist', 'remove'])]
    private ?Park $park = null;

    #[ORM\OneToOne(mappedBy: 'location', targetEntity: Walk::class, cascade: ['persist', 'remove'])]
    private ?Walk $walkLocation = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(float $latitude): self
    {
        $this->latitude = $latitude;
        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(float $longitude): self
    {
        $this->longitude = $longitude;
        return $this;
    }

    public function getPark(): ?Park
    {
        return $this->park;
    }

    public function setPark(Park $park): self
    {
        // set the owning side of the relation if necessary
        if ($this->park !== null && $this->park->getLocation() !== $this) {
            $this->park->setLocation($this);
        }
        $this->park = $park;
        return $this;
    }

    public function getWalkLocation(): ?Walk
    {
        return $this->walkLocation;
    }

    public function setWalkLocation(?Walk $walkLocation): self
    {
        $this->walkLocation = $walkLocation;
        return $this;
    }
}