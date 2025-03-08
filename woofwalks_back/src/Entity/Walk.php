<?php

namespace App\Entity;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\WalkRepository;
use ApiPlatform\Metadata\ApiResource;
use App\Entity\MainPhoto;
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

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: 'text')]
    private ?string $description = null;

    // #[ORM\Column(type: 'string', length: 100)]
    // private ?string $theme = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: 'integer')]
    private ?int $maxParticipants = null;

    #[Groups(['walk:read', 'walk:write'])]
    #[ORM\ManyToOne(targetEntity: MainPhoto::class, cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: true)]
    private MainPhoto $mainPhoto;


    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
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
    public function getMainPhoto(): MainPhoto
    {
        return $this->mainPhoto;
    }

    public function setMainPhoto(MainPhoto $mainPhoto): self
    {
        $this->mainPhoto = $mainPhoto;
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

    // public function getTheme(): ?string
    // {
    //     return $this->theme;
    // }

    // public function setTheme(string $theme): self
    // {
    //     $this->theme = $theme;

    //     return $this;
    // }

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
}
