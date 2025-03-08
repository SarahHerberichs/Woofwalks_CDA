<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[Vich\Uploadable]
#[ORM\Entity]
#[ApiResource(
    normalizationContext: ['groups' => ['MainPhoto:read']],
    denormalizationContext: ['groups' => ['MainPhoto:write']],
    types: ['https://schema.org/MediaObject'],
    outputFormats: ['jsonld' => ['application/ld+json']],
    operations: [
        new Get(),
        new GetCollection(),
        new Post(
            inputFormats: ['multipart' => ['multipart/form-data']],
            openapi: new Model\Operation(
                requestBody: new Model\RequestBody(
                    content: new \ArrayObject([
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'file' => [
                                        'type' => 'string',
                                        'format' => 'binary'
                                    ]
                                ]
                            ]
                        ]
                    ])
                )
            )
        )
    ]
)]
class MainPhoto
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['MainPhoto:read', 'ad:read','walk:read'])]
    private ?int $id = null;
    

    #[ApiProperty(types: ['https://schema.org/contentUrl'], writable: false)]
    #[Groups(['MainPhoto:read', 'ad:read'])]
    public ?string $contentUrl = null;

    #[Vich\UploadableField(mapping: 'MainPhoto', fileNameProperty: 'filePath')]
    #[Assert\NotNull(groups: ['MainPhoto:write'])]
    #[Groups(['MainPhoto:write'])]
    private ?File $file = null;

    #[ApiProperty(writable: false)]
    #[ORM\Column(nullable: true)]
    #[Groups(['MainPhoto:read', 'ad:read', 'walk:read'])]
    private ?string $filePath = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContentUrl(): ?string
    {
        if ($this->filePath) {
            return '/media/' . $this->filePath;
        }

        return null;
    }

    public function setFile(?File $file = null): void
    {
        $this->file = $file;

        // if ($file) {
        //     // Met à jour la date de modification à chaque nouvel upload
        //     $this->updatedAt = new \DateTimeImmutable();
        // }
    }

    public function getFile(): ?File
    {
        return $this->file;
    }

    public function getFilePath(): ?string
    {
        return $this->filePath;
    }

    public function setFilePath(?string $filePath): void
    {
        $this->filePath = $filePath;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): void
    {
        $this->updatedAt = $updatedAt;
    }
}
