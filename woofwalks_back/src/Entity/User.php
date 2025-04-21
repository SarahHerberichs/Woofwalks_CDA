<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post; // Ajoute cette ligne
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ApiResource(
    operations: [
        new Post(processor: \App\DataPersister\UserDataPersister::class)     ],
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']],
)]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['user:read', 'user:write', 'walk:read'])]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[Groups(['user:write'])]
    private ?string $plainPassword = null;

    #[ORM\OneToMany(mappedBy: 'creator', targetEntity: Walk::class, orphanRemoval: true)]
    private Collection $createdWalks;

    #[ORM\ManyToMany(mappedBy: 'participants', targetEntity: Walk::class)]
    private Collection $participatedWalks;

    #[Groups(['user:read', 'user:write'])]
    #[ORM\Column(length: 100)]
    private ?string $username = null;

    public function __construct()
    {
        $this->createdWalks = new ArrayCollection();
        $this->participatedWalks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    /**
     * A visual identifier that represents this user instance.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }
    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }
    
    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;
        return $this;
    }
    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Walk>
     */
    public function getCreatedWalks(): Collection
    {
        return $this->createdWalks;
    }

    public function addCreatedWalk(Walk $createdWalk): self
    {
        if (!$this->createdWalks->contains($createdWalk)) {
            $this->createdWalks[] = $createdWalk;
            $createdWalk->setCreator($this);
        }
        return $this;
    }

    public function removeCreatedWalk(Walk $createdWalk): self
    {
        if ($this->createdWalks->removeElement($createdWalk)) {
            // set the owning side to null (unless already changed)
            if ($createdWalk->getCreator() === $this) {
                $createdWalk->setCreator(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, Walk>
     */
    public function getParticipatedWalks(): Collection
    {
        return $this->participatedWalks;
    }

    public function addParticipatedWalk(Walk $participatedWalk): self
    {
        if (!$this->participatedWalks->contains($participatedWalk)) {
            $this->participatedWalks[] = $participatedWalk;
            $participatedWalk->addParticipant($this);
        }
        return $this;
    }

    public function removeParticipatedWalk(Walk $participatedWalk): self
    {
        if ($this->participatedWalks->removeElement($participatedWalk)) {
            $participatedWalk->removeParticipant($this);
        }
        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }
}