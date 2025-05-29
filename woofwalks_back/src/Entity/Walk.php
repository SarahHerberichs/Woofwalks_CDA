<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\WalkRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    normalizationContext: ['groups' => ['walk:read']],
    denormalizationContext: ['groups' => ['walk:write']],
)]
#[ORM\Entity(repositoryClass: WalkRepository::class)]
class Walk
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    
    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(length: 255)]
    #[Groups(['walk:read', 'walk:write'])]
    private ?string $title = null;

    #[ORM\Column(type: 'text')]
    #[Groups(['walk:read', 'walk:write'])]
    private ?string $description = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['walk:read', 'walk:write'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: 'integer')]
    #[Groups(['walk:read', 'walk:write'])]
    private ?int $maxParticipants = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'createdWalks')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['walk:read'])]
    private ?User $creator = null;

    #[ORM\OneToOne(targetEntity: Location::class, cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['walk:read', 'walk:write'])]
    private ?Location $location = null;

    #[ORM\ManyToOne(targetEntity: MainPhoto::class, inversedBy: 'walks')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['walk:read', 'walk:write'])]
    private ?MainPhoto $mainPhoto = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'participatedWalks')]
    #[ORM\JoinTable(name: 'walk_participants')]
    #[Groups(['walk:read'])]
    private Collection $participants;

    #[ORM\OneToOne(targetEntity: Chat::class, mappedBy: 'walk', cascade: ['persist', 'remove'])]
    #[Groups(['walk:read'])]
    private ?Chat $chat = null;

    #[ORM\Column(type: 'boolean')]
    private bool $isCustomLocation = true;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->participants = new ArrayCollection();
    }

    #[ORM\PreUpdate]
    public function updateTimestamp(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(): self
    {
        $this->updatedAt = new \DateTimeImmutable();
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;
        return $this;
    }

    public function getMaxParticipants(): ?int
    {
        return $this->maxParticipants;
    }

    public function setMaxParticipants(int $maxParticipants): self
    {
        $this->maxParticipants = $maxParticipants;
        return $this;
    }

    public function getCreator(): ?User
    {
        return $this->creator;
    }

    public function setCreator(?User $creator): self
    {
        $this->creator = $creator;
        return $this;
    }

    public function getLocation(): ?Location
    {
        return $this->location;
    }

    public function setLocation(?Location $location): self
    {
        $this->location = $location;
        return $this;
    }

    public function getMainPhoto(): ?MainPhoto
    {
        return $this->mainPhoto;
    }

    public function setMainPhoto(?MainPhoto $mainPhoto): self
    {
        $this->mainPhoto = $mainPhoto;
        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getParticipants(): Collection
    {
        return $this->participants;
    }

    public function addParticipant(User $participant): self
    {
        if (!$this->participants->contains($participant)) {
            $this->participants[] = $participant;
        }
        return $this;
    }

    public function removeParticipant(User $participant): self
    {
        $this->participants->removeElement($participant);
        return $this;
    }

    public function getChat(): ?Chat
    {
        return $this->chat;
    }

    public function setChat(Chat $chat): self
    {
        // set the owning side of the relation if necessary
        if ($this->chat !== $chat) {
            $this->chat = $chat;
            if ($chat !== null && $chat->getWalk() !== $this) {
                $chat->setWalk($this);
            }
        }
        return $this;
    }

        public function getIsCustomLocation(): bool
    {
        return $this->isCustomLocation;
    }

    public function setIsCustomLocation(bool $isCustomLocation): self
    {
        $this->isCustomLocation = $isCustomLocation;
        return $this;
    }
}