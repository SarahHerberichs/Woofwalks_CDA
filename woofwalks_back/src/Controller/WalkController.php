<?php
    namespace App\Controller;


    use App\Repository\PhotoRepository;


    use App\Entity\MainPhoto;
    use App\Entity\Walk;
    // use App\Repository\MainPhotoRepository;
    use Doctrine\ORM\EntityManagerInterface;
    use Symfony\Component\HttpFoundation\Request;
    use Symfony\Component\HttpFoundation\JsonResponse;
    use Symfony\Component\Routing\Annotation\Route;
    use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
    
    class WalkController extends AbstractController
    {

        #[Route('/api/walkscustom', name: 'create_walk', methods: ['POST'])]
        public function createWalk(Request $request, EntityManagerInterface $em, PhotoRepository $photoRepository): JsonResponse
        {
            $data = json_decode($request->getContent(), true);
            // $creator = $em->getRepository(User::class)->find(1); // Utiliser un ID existant ou créez un utilisateur temporaire
            // Vérification des champs obligatoires
            if (
                empty($data['title']) || 
                empty($data['description']) || 
                empty($data['datetime']) || 
                empty($data['photo'])
            ) {
                return new JsonResponse(['error' => 'Missing required fields'], 400);
            }
            try {
                $datetime = new \DateTime($data['datetime']);
            } catch (\Exception $e) {
                return new JsonResponse(['error' => 'Invalid datetime format: ' . $e->getMessage()], 400);
            }
            // Récupérer la photo associée à l'ID
            $photo = $photoRepository->find($data['photo']);
            if (!$photo) {
                return new JsonResponse(['error' => 'Photo not found'], 404);
            }
    
            // Vérifier si l'Ad avec l'ID 20 existe déjà
     
    
            // Si l'Ad n'existe pas, en créer un nouveau
            $walk = new Walk();
            $walk->setTitle($data['title']);
            $walk->setDescription($data['description']);
            $walk->setMainPhoto($photo);  // Associer la photo à l'Ad
            $walk->setDate($datetime); // Enregistrement de la date complète
                // $ad->setCreator($creator);
            $walk->setMaxParticipants($data['max_participants']);
        
            // Persister la Walk et sauvegarder les entités
            $em->persist($walk);  
            $em->flush();  // Sauvegarde des deux entités dans la base de données
        
            return new JsonResponse(['message' => 'Walk created successfully'], 201);
        }

    }        
  