<?php
    namespace App\Controller;


    use App\Repository\PhotoRepository;


    use App\Entity\MainPhoto;
    use App\Entity\User;
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
                !isset($data['title']) || trim($data['title']) === '' ||
                !isset($data['description']) || trim($data['description']) === '' ||
                !isset($data['date']) || trim($data['date']) === '' ||
                !isset($data['photo']) || empty($data['photo']) || // empty() devrait fonctionner pour un entier > 0
                !isset($data['max_participants']) || empty($data['max_participants']) // empty() devrait fonctionner pour un entier > 0 ou une chaîne non vide
            ) {
                var_dump('title isset:', isset($data['title']));
                var_dump('title trimmed empty:', trim($data['title']) === '');
                var_dump('description isset:', isset($data['description']));
                var_dump('description trimmed empty:', trim($data['description']) === '');
                var_dump('date isset:', isset($data['date']));
                var_dump('date trimmed empty:', trim($data['date']) === '');
                var_dump('photo isset:', isset($data['photo']));
                var_dump('photo empty:', empty($data['photo']));
                var_dump('max_participants isset:', isset($data['max_participants']));
                var_dump('max_participants empty:', empty($data['max_participants']));
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
    
            $simulatedUser = $em->getRepository(User::class)->find($data['creator']);
            if (!$simulatedUser) {
                return new JsonResponse(['error' => 'Creator not found'], 404);
            }
            // Si l'Ad n'existe pas, en créer un nouveau
            $walk = new Walk();
            $walk->setTitle($data['title']);
            $walk->setDescription($data['description']);
            $walk->setMainPhoto($photo);  // Associer la photo à l'Ad
            $walk->setDate($datetime); // Enregistrement de la date complète
            $walk->setMaxParticipants($data['max_participants']);
            $walk->setCreator($simulatedUser); // Définir l'utilisateur simulé comme créateur
        
            // Persister la Walk et sauvegarder les entités
            $em->persist($walk);  
            $em->flush();  // Sauvegarde des deux entités dans la base de données
        
            return new JsonResponse(['message' => 'Walk created successfully'], 201);
        }

    }        
  