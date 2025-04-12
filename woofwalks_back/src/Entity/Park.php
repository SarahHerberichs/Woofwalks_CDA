<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ParkRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    normalizationContext: ['groups' => ['park:read']],
    denormalizationContext: ['groups' => ['park:write']],
)]
#[ORM\Entity(repositoryClass: ParkRepository::class)]
class Park
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['park:read', 'park:write'])]
    private ?string $name = null;

    #[ORM\OneToOne(targetEntity: Location::class, cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['park:read', 'park:write'])]
    private ?Location $location = null;

    #[ORM\OneToMany(mappedBy: 'park', targetEntity: Walk::class)]
    private Collection $walks;

    public function __construct()
    {
        $this->walks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getLocation(): ?Location
    {
        return $this->location;
    }

    public function setLocation(Location $location): self
    {
        $this->location = $location;
        return $this;
    }

    /**
     * @return Collection<int, Walk>
     */
    public function getWalks(): Collection
    {
        return $this->walks;
    }

    public function addWalk(Walk $walk): self
    {
        if (!$this->walks->contains($walk)) {
            $this->walks[] = $walk;
            $walk->setPark($this);
        }
        return $this;
    }

    public function removeWalk(Walk $walk): self
    {
        if ($this->walks->removeElement($walk)) {
            // set the owning side to null (unless already changed)
            if ($walk->getPark() === $this) {
                $walk->setPark(null);
            }
        }
        return $this;
    }
}