-- MySQL dump 10.13  Distrib 5.7.44, for Linux (x86_64)
--
-- Host: localhost    Database: woofwalks_docker
-- ------------------------------------------------------
-- Server version	5.7.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `channel`
--

DROP TABLE IF EXISTS `channel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `channel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `channel`
--

LOCK TABLES `channel` WRITE;
/*!40000 ALTER TABLE `channel` DISABLE KEYS */;
INSERT INTO `channel` VALUES (7,'email'),(8,'sms');
/*!40000 ALTER TABLE `channel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `channel_user`
--

DROP TABLE IF EXISTS `channel_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `channel_user` (
  `channel_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`channel_id`,`user_id`),
  KEY `IDX_11C7753772F5A1AA` (`channel_id`),
  KEY `IDX_11C77537A76ED395` (`user_id`),
  CONSTRAINT `FK_11C7753772F5A1AA` FOREIGN KEY (`channel_id`) REFERENCES `channel` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_11C77537A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `channel_user`
--

LOCK TABLES `channel_user` WRITE;
/*!40000 ALTER TABLE `channel_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `channel_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `walk_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_659DF2AA5EEE1B48` (`walk_id`),
  CONSTRAINT `FK_659DF2AA5EEE1B48` FOREIGN KEY (`walk_id`) REFERENCES `walk` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES (1,55);
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_message`
--

DROP TABLE IF EXISTS `chat_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) NOT NULL,
  `chat_id` int(11) NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_FAB3FC16F624B39D` (`sender_id`),
  KEY `IDX_FAB3FC161A9A7125` (`chat_id`),
  CONSTRAINT `FK_FAB3FC161A9A7125` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`id`),
  CONSTRAINT `FK_FAB3FC16F624B39D` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_message`
--

LOCK TABLES `chat_message` WRITE;
/*!40000 ALTER TABLE `chat_message` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,49.128911,6.212366,'','Metz','Rue des Frênes'),(2,49.116638,6.182334,'','Metz','Rue Mazelle'),(3,48.548865,7.737624,'','Strasbourg','Rue de la Côte d\'Azur'),(4,49.117658,6.226978,'','Metz','Rue d\'Anjou'),(5,49.101307,6.173845,'','Metz','Rue Kellermann'),(6,48.559258,2.673011,'','Rubelles','Rue de la Dame de Miramion'),(7,49.117416,6.177122,'truc','Metz','Rue de la Tête d\'Or'),(8,49.11312,6.180639,'','Metz','Rue d\'Asfeld'),(9,48.558389,7.749156,'','Strasbourg','Avenue de Colmar'),(10,48.604181,7.780795,'','Strasbourg','Rue Boecklin'),(11,50.717215,2.631984,'','Strazeele','Rue de la Gare'),(12,47.492,-2.797832,'','Sarzeau','Rue d’Ar Men'),(13,46.756085,4.846091,'','Lux','Rue de la Libération'),(14,50.356871,3.301407,'','Fenain','Rue d\'Abscon'),(15,50.356871,3.301407,'','Fenain','Rue d\'Abscon'),(16,49.115769,6.177886,'','Metz','Rue du Grand Cerf'),(17,48.579831,7.761454,'','Strasbourg','Strasbourg'),(18,49.440753,1.100755,'','Rouen','Rue d\'Amiens'),(19,49.076629,6.197167,'','Metz','Rue des Anciens Combattants d\'Afrique du Nord'),(20,50.700142,3.192514,'','Roubaix','Rue d\'Alger'),(21,43.830454,1.726895,'','Rabastens','Rue des Collines'),(22,49.057156,2.108879,'','Pontoise','Rue Adrien Lemoine'),(23,49.163789,6.73944,'','L\'Hôpital','Rue d’Uberherrn'),(27,48.866667,2.333333,'Test Location','Paris','Rue de la Paix'),(28,72.929396,-123.677907,'Duhamel','Gaillard','rue de Coste'),(29,24.024128,155.208399,'Etienne','Legros','rue Leclercq'),(30,-19.998694,164.407732,'Peltier SAS','Morvan-sur-Vaillant','rue Hamel'),(31,69.19877,-68.047837,'Jacob Mahe et Fils','Fischer','chemin de Daniel'),(32,44.541883,32.838922,'Begue','Colletdan','rue de Michaud'),(33,62.631771,37.399047,'Guillon','Meyer-les-Bains','chemin Astrid Remy'),(34,39.881375,-69.290249,'Leger S.A.','Delorme-la-Forêt','boulevard Noémi Fernandes'),(35,-71.680685,-58.115208,'Roussel','Maillard-sur-Mer','boulevard Simon'),(36,81.640082,-155.508365,'Gros Lenoir S.A.','Diaz','place Dumas'),(37,84.48748,144.389626,'Perrot et Fils','Perez','rue Ramos'),(38,49.076629,6.197167,'un lieu bien','Metz','Rue des Anciens Combattants d\'Afrique du Nord'),(39,49.108547,6.192916,'A metz au calm','Metz','Rue de Queuleu'),(40,48.556252,3.298745,'efz','Provins','Boulevard Carnot'),(41,48.828565,2.325004,'ZEFD','Paris','Rue d\'Alésia'),(42,48.828565,2.325004,'ZEFD','Paris','Rue d\'Alésia'),(43,49.076629,6.197167,'ic','Metz','Rue des Anciens Combattants d\'Afrique du Nord');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `main_photo`
--

DROP TABLE IF EXISTS `main_photo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `main_photo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `main_photo`
--

LOCK TABLES `main_photo` WRITE;
/*!40000 ALTER TABLE `main_photo` DISABLE KEYS */;
INSERT INTO `main_photo` VALUES (1,'shepherd-dog-4357790-960-720-68a42dfaf341c.jpg',NULL),(2,'photoUserProfil-68a43661ed42e.jpg',NULL),(3,'ParcForet-68a438d9917ea.jpg',NULL),(4,'istockphoto-812207382-1024x1024-68a43949d35d1.jpg',NULL),(5,'photoUserProfil-68a443b8512e8.jpg',NULL),(6,'ParcForet-68a44c42ed38c.jpg',NULL),(7,'meteo-68a44ccb51d9c.png',NULL),(8,'meteo-68a45fbd6c666.png',NULL),(9,'istockphoto-658883866-1024x1024-68a468be2f31b.jpg',NULL),(10,'istockphoto-155383196-1024x1024-68a46d5e15a62.jpg',NULL),(11,'chienLaisse-68a472015d6d9.png',NULL),(12,'EauIcon-68a478743b527.png',NULL),(13,'MontagneIcon-68a47a9e22594.png',NULL),(14,'istockphoto-812207382-1024x1024-68a485315a153.jpg',NULL),(15,'user-68a5a545856bf.png',NULL),(16,'user-68a5a5a4dcb10.png',NULL),(17,'leaflet-68a5bb3ade4c0.png',NULL),(18,'shepherd-dog-4357790-960-720-68a5bb529fbde.jpg',NULL),(19,'leaflet-68a5bb6cc39b6.png',NULL),(20,'jaugeDifficult-3-68a5c67d18c64.png',NULL),(21,'leaflet-68a5c693bb774.png',NULL),(22,'istockphoto-104489865-1024x1024-68a5c6a9d39b6.jpg',NULL),(23,'horloge-murale-68a5c8d56b2ba.png',NULL),(24,'horloge-murale-68a5cb88459fa.png',NULL),(28,'test_photo.jpg',NULL),(29,'horloge-murale-68a5d17d3042d.png',NULL),(30,'EauIcon-68a5d36ec1c97.png',NULL),(31,'horloge-murale-68a5d472b45bc.png',NULL),(32,'planification-68a5d486f159c.png',NULL),(33,'planification-68a5d4e294852.png',NULL),(34,'horloge-murale-68a5d4fe00def.png',NULL),(35,'leaflet-68a5d51473e68.png',NULL),(36,'istockphoto-104489865-1024x1024-68a5d5281465b.jpg',NULL),(37,'plus-68b6d9e484067.png',NULL),(38,'ParcBanc-68b6db1d55e7d.jpg',NULL),(39,'plus-68b6dc7582033.png',NULL),(40,'marqueur-68b6dcbd91971.png',NULL),(41,'leaflet-68b6dcdf11ebd.png',NULL),(42,'istockphoto-104489865-1024x1024-68b7352e4e9e7.jpg',NULL),(43,'marqueur-68b73571f1f20.png',NULL),(44,'ParcForet-68b736d08694c.jpg',NULL),(45,'marqueur-68b73b849bc92.png',NULL),(46,'shepherd-dog-4357790-960-720-68b741489b609.jpg',NULL),(47,'meteo-68b74603274dc.png',NULL),(48,'leaflet-68b74a313790d.png',NULL),(49,'plus-68bad84850b0f.png',NULL),(50,'istockphoto-155383196-1024x1024-68bae9a3a3dec.jpg',NULL),(51,'leaflet-68baec92a12cc.png',NULL),(52,'leaflet-68baef51cdacf.png',NULL),(53,'marqueur-68baefa6d0fd3.png',NULL),(54,'marqueur-68baefbcecacd.png',NULL),(55,'marqueur-68baeffc9b6ba.png',NULL),(56,'marqueur-68baf00cf24d8.png',NULL),(57,'leaflet-68baf0787c0d7.png',NULL),(58,'marqueur-68baf15680612.png',NULL),(59,'marqueur-68baf1799893c.png',NULL),(60,'cloche-68baf1c39eec4.png',NULL),(61,'istockphoto-155383196-1024x1024-68baf2178c8ad.jpg',NULL),(62,'istockphoto-155383196-1024x1024-68baf240c101d.jpg',NULL),(63,'istockphoto-155383196-1024x1024-68baf24a366eb.jpg',NULL),(64,'istockphoto-104489865-1024x1024-68baf33fd6e35.jpg',NULL),(65,'EauIcon-68baf35dc715d.png',NULL),(66,'istockphoto-155383196-1024x1024-68baf4745a61b.jpg',NULL),(67,'user-68baf526e3543.png',NULL),(68,'user-68baf53ecbf74.png',NULL),(69,'shepherd-dog-4357790-960-720-68c2d37e196b9.jpg',NULL),(70,'user-68c2d3a3205a0.png',NULL),(71,'marqueur-68c2d3ca719fd.png',NULL),(72,'leaflet-68c2dc3d228f1.png',NULL);
/*!40000 ALTER TABLE `main_photo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `channel_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_BF5476CA72F5A1AA` (`channel_id`),
  KEY `IDX_BF5476CAA76ED395` (`user_id`),
  CONSTRAINT `FK_BF5476CA72F5A1AA` FOREIGN KEY (`channel_id`) REFERENCES `channel` (`id`),
  CONSTRAINT `FK_BF5476CAA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `park`
--

DROP TABLE IF EXISTS `park`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `park` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location_id` int(11) NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_C4077D3364D218E` (`location_id`),
  CONSTRAINT `FK_C4077D3364D218E` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `park`
--

LOCK TABLES `park` WRITE;
/*!40000 ALTER TABLE `park` DISABLE KEYS */;
INSERT INTO `park` VALUES (1,28,'Iusto ipsam quo assumenda inventore quia voluptatem magnam. Sunt et modi optio. Autem recusandae eius sed soluta dolore hic.'),(2,29,'Expedita eos ut atque aspernatur culpa placeat voluptate. Tenetur voluptate hic facilis quod. Est quia ipsam quae ea. Omnis ullam laborum est est.'),(3,30,'Quis praesentium aut laudantium quos sint consequuntur. Nemo maxime necessitatibus ducimus officia quia voluptatum. Est in aut quis aut quibusdam. Aspernatur enim aliquam ut id.'),(4,31,'Doloribus cupiditate rem autem consequatur et. Sit enim exercitationem corrupti qui vitae laborum vero eos. Optio voluptatem nemo qui ut dolorem animi.'),(5,32,'Quis et asperiores nemo assumenda aut. Eius labore culpa dolores excepturi. Nesciunt quibusdam ad sint laborum hic asperiores. Ratione sequi delectus aut nostrum optio.'),(6,33,'Ut est dolorum sed id nemo asperiores ipsa eveniet. Explicabo veritatis quia deleniti qui. Et dolore debitis hic nihil expedita.'),(7,34,'Adipisci et doloremque fugit tempora earum. Sunt et doloremque aperiam. Et soluta consequatur distinctio non aut facilis. Odio sequi sit sit iure nobis. Labore quia non sit laudantium ratione veritatis.'),(8,35,'Sint repellendus velit omnis dolor modi. Accusamus vel blanditiis suscipit non ex repellat quo hic. Sint et reiciendis quod eum optio voluptas praesentium corrupti. Ut rerum dolor optio qui sed cumque eaque.'),(9,36,'Eveniet nihil suscipit perferendis blanditiis facilis mollitia. Voluptatibus quidem consectetur quo quibusdam quis corporis quia. Tempora quae dignissimos praesentium eos.'),(10,37,'Est aut vitae amet itaque. Quae autem laboriosam beatae ut et. Esse dolorum qui aut. Modi nihil id sunt et aut. Et ipsum velit consectetur tempore repellendus impedit nisi et.');
/*!40000 ALTER TABLE `park` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `refresh_token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `refresh_token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valid` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_C74F2195C74F2195` (`refresh_token`)
) ENGINE=InnoDB AUTO_INCREMENT=191 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

LOCK TABLES `refresh_token` WRITE;
/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
INSERT INTO `refresh_token` VALUES (94,'ec6b9d68072ad9bad030cc202814d6c8cbd0c78459c5dcbce46561defeba45a2f7823841f67026f6','test@example.com','2025-09-21 14:33:36'),(98,'3f8368e4b16f852fcac34ffc6a944fcbfdde93d8b5a9c7a8f378dcc7b298f5104ac2aaa8cd757ff5','herberichs.sarah@gmail.com','2025-09-26 19:19:29'),(99,'b9aa9eca837c3c25afa03d780216e9a5fe69666335003a8b17f07f57e971008245268eefd1a4e471','herberichs.sarah@gmail.com','2025-09-27 11:02:15'),(100,'51705191f07cabd38342ffce5d87f10d1d116048b4397010d1a8be57525ddf941a19a811f8378f21','herberichs.sarah@gmail.com','2025-10-01 13:19:18'),(101,'4f4126029e5f436481d7397d1681b246a32f5c21d98a86885854afb3de26e0f2fa931a7d8cdd9f80','herberichs.sarah@gmail.com','2025-10-01 14:11:24'),(102,'59f16c05e379836e534f9bcf56917dd3511ec8dee4a720efc3f5fccdbeac7f1b9b082a4aa45622f3','herberichs.sarah@gmail.com','2025-10-01 14:23:48'),(103,'a0702d646ff50d3dd048e8f2e5883e3405095812c85ada814e46345c2764bf842e8b724123c2ed47','herberichs.sarah@gmail.com','2025-10-01 15:45:46'),(108,'51d729f927f004a1053341edf931bfe88bb0311e3bdf2018206e34bb10a070d60211d63441025be33962f5923e7cf394ba61bcce57f272f4d7959438d1ebf073','herberichs.sarah@gmail.com','2025-10-02 18:18:28'),(109,'d402add9867a5e33b5d936eaf6fd06437852271a27887af17fd43992235f3339b66ad39865f4b42c','herberichs.sarah@gmail.com','2025-10-02 18:33:37'),(110,'c700ce31f78bbd540bda7e24c6387ed5c4420647421478017a454ae32ef3f4912a5690ddfbde9b4f','herberichs.sarah@gmail.com','2025-10-02 18:45:18'),(112,'c693854265aba0efa880b5427026910838623e186f479313772635bfef2bd28583d6562e8850c3a64ba0c70f3d9f1713dc73f00b6998251724655adb9f36efa5','herberichs.sarah@gmail.com','2025-10-02 19:10:48'),(117,'254d692b85baa8d7e855b5da4e63cb49a09cef7a8ed88a7e0140081211e6cecc8430444808e77b53c65b520eba08f38d8fb626307a4520a370c67cfb0090b47d','herberichs.sarah@gmail.com','2025-10-03 13:52:46'),(118,'57e2c13caa4981330ee2f09a63fa0ff1a76be501a165b6aec37f6d7d3d6d1b96b3c245b27b5f4f6e','herberichs.sarah@gmail.com','2025-10-04 11:45:02'),(120,'1cadf7a0291f40205792dbdd9b530aff8b8f785a5c3fc9cf6e2edfa6ed6c60db34e0b042118ea8ce5e7909e4bfec75e83c05027a3e387e9b0c68b748b27996b9','herberichs.sarah@gmail.com','2025-10-05 07:23:11'),(122,'45cba306394da7a3d56a4048b82b13f71bf5fbf13fb49e042fa74a585f01e6adf13d17a9af70e1b6761484af6ea8f27853e8f5f816ef7c21b133c47bed27ba2f','herberichs.sarah@gmail.com','2025-10-05 08:13:22'),(124,'c8ef107873e9ccbe5724bb93a2b9c97f0db76c7cc2bb21d1afe0499ed7ae772402a83bc5ee2f2df08ce683c79fc88233a95c31df2a096f3c6c39c366e2ce4dcc','herberichs.sarah@gmail.com','2025-10-05 09:36:22'),(125,'fda8928b9302d1ac7305cc0556554a56cc67471b246449cc01824f30ed0c98da3a57f7dd83c02894','herberichs.sarah@gmail.com','2025-10-05 10:06:27'),(169,'3e29672c6391683c739127158ad47aa6d752ad76b976cf6f5ab03b270251124757ad047a211107ea4e501ffe4399cde0c5d6d151f4d319aa7768cb2a85688020','sarah.herberichs@neuf.fr','2025-10-05 10:51:02'),(170,'c5319dc6e04112a4de550f0f343429b7ef1449d324f24b29183297d74fbbfd8e60bf3496515fa2d5','sarah.herberichs@neuf.fr','2025-10-05 10:51:31'),(172,'b39d5c276171f9ba255a1ef9bb43d42eea3caf0b5fe297639e542a0ee8ec1322f737a1b7b4ae52bd','sarah.herberichs@neuf.fr','2025-10-05 11:10:19'),(180,'6641851ffa1f6dce8df93740771cfa12b515cedff33baae034c4462e51f05cf6e22a987230db0222c878cb6b3b80ccfe365de01b6d2405dd1e80d6f2240d6331','herberichs.sarah@gmail.com','2025-10-05 14:50:30'),(182,'df7d1c34a8259ded2a085fe0169a8acaf8c8b3aff8dc4a429247c7f8d78ebee22b01c560b5bb74813ca5c62406021de4a6815a2ae0f5a0dd1ceaaa6a8bf06120','herberichs.sarah@gmail.com','2025-10-08 14:16:47'),(183,'82ab7a7f55d4d8fa08be7c0c4c0a5a42c7e60712ddf785ea324389e39d045817a675603fe20cafbd','herberichs.sarah@gmail.com','2025-10-08 14:23:34'),(184,'13ef4f9ac395d16a06b4245635aca648740a18860863e055091748fb51c7c610ffcb702edf530129','herberichs.sarah@gmail.com','2025-10-08 15:01:28'),(185,'ecd97a9bf1e6ae388f2e5b58a1ff932cd245ec117384a91e787a5d13aa99ed4e50782a4fd11f405c','herberichs.sarah@gmail.com','2025-10-08 15:07:16'),(186,'f2853d7110e523adf00a5d49c368211e782a18f0989fe0d65a604d080c5b61fee3304791194a3c7d','herberichs.sarah@gmail.com','2025-10-08 15:42:01'),(187,'14da20fb3ccdd322108c3c753afaba40c2429418eb74194fd6c7619691a46d66f979a71e6c85850f','herberichs.sarah@gmail.com','2025-10-10 08:54:34'),(189,'9707e163841522411b681b56356eac4bdf562ae8e53623836a7eeac4100c981356a26667b7609d15b74474b70e777be60e0b43fcebf1a8ea45b4f1b36fca8b97','herberichs.sarah@gmail.com','2025-10-11 14:19:58'),(190,'651e49fac9af934f92ff7f6235373aa3aa28e1260e112ac0c9494b7873074a625bb2b36081f2094e','herberichs.sarah@gmail.com','2025-10-13 08:47:35');
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` json NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `confirmation_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `cgv_accepted` tinyint(1) NOT NULL,
  `confirmation_requested_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_8D93D649E7927C74` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'test2@test.com','[\"ROLE_USER\"]','$2y$13$xqt9pIy0go7BRMw8IGo4CeVfxV4lo1wRm5nosAfxWYK52L2pe6Peu','Test2','a38c3f7f-7473-46ae-9e1e-791e64cd6956',0,1,'2025-08-19 07:50:42'),(2,'herberichs.sarah@gmail.com','[\"ROLE_USER\"]','$2y$13$Ym8t5tfj.Ci5lwHULzr2UOpLdHfdq47fAJc86BzhwDByibRKohVqa','lala',NULL,1,1,'2025-08-19 07:54:08'),(4,'sarah.herberichs@3wa.io','[\"ROLE_USER\"]','$2y$13$ZgJVAfpfUF0N63VBu7X5P.HZcIlvdi1Ik0Cn2tCDUm7T2YdshZjyu','lila',NULL,1,1,'2025-08-19 07:56:26'),(7,'test@example.com','[\"ROLE_USER\"]','$2y$13$I3s8fNIm14pYPCYp5AHmiuvqmpRvvQZIYm5No8x6MYN4.Hjyv0Pu.','roudoudou',NULL,1,1,NULL),(21,'herculepoivrot666@gmail.com','[\"ROLE_USER\"]','$2y$13$YJNQO320JX0h3vm1sYzi3ObRRpPPY4DEs5Mz.2iPOtcGabWSY3jbK','herculos','af5f399c-5eda-4562-815e-20321dfb6812',0,1,'2025-09-05 14:51:14');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `walk`
--

DROP TABLE IF EXISTS `walk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `walk` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `creator_id` int(11) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `main_photo_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime NOT NULL,
  `max_participants` int(11) NOT NULL,
  `is_custom_location` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_8D917A5561220EA6` (`creator_id`),
  KEY `IDX_8D917A5564D218E` (`location_id`),
  KEY `IDX_8D917A55A7BC5DF9` (`main_photo_id`),
  CONSTRAINT `FK_8D917A5561220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_8D917A5564D218E` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`),
  CONSTRAINT `FK_8D917A55A7BC5DF9` FOREIGN KEY (`main_photo_id`) REFERENCES `main_photo` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `walk`
--

LOCK TABLES `walk` WRITE;
/*!40000 ALTER TABLE `walk` DISABLE KEYS */;
INSERT INTO `walk` VALUES (1,2,1,1,'2025-08-19 07:55:39','2025-08-19 07:55:39','une ad','salut','2032-10-10 22:22:00',15,1),(2,2,2,2,'2025-08-19 08:31:30','2025-08-19 08:31:30','salut','zef','2032-10-10 22:22:00',5,1),(3,2,3,4,'2025-08-19 08:43:54','2025-08-19 08:43:54','ze','ze','1011-10-10 20:32:00',5,1),(4,2,4,5,'2025-08-19 09:28:24','2025-08-19 09:28:24','lala','zpoek','2032-10-10 22:22:00',5,1),(5,2,5,6,'2025-08-19 10:04:51','2025-08-19 10:04:51','zefc','fze','2032-10-10 22:22:00',22,1),(6,2,6,7,'2025-08-19 10:07:07','2025-08-19 10:07:07','sa','la','2037-07-07 07:07:00',7,1),(7,2,7,8,'2025-08-19 11:27:57','2025-08-19 11:27:57','salut','ca va','2032-10-10 22:22:00',15,1),(8,2,8,9,'2025-08-19 12:06:22','2025-08-19 12:06:22','salut','tu','2032-02-02 22:02:00',1,1),(9,2,9,10,'2025-08-19 12:26:06','2025-08-19 12:26:06','coucou','ca va','2032-10-10 22:02:00',5,1),(51,2,30,68,'2025-09-05 14:35:43','2025-09-05 14:35:43','qegfdqs','ergdfdq','2055-10-10 05:05:00',5,0),(52,2,35,69,'2025-09-11 13:49:50','2025-09-11 13:49:50','nouvelle ad ','bin ouf jen ai mar','2025-10-10 05:05:00',5,0),(53,2,37,70,'2025-09-11 13:50:27','2025-09-11 13:50:27','today','poerkf','2025-09-11 20:20:00',2,0),(54,2,34,71,'2025-09-11 13:51:06','2025-09-11 13:51:06','me sui trompéoerijf','oijsmdfs','2025-09-11 20:20:00',20,0),(55,2,43,72,'2025-09-11 14:27:09','2025-09-11 14:27:09','strhgdfs','fdnhdf','2032-10-10 22:02:00',2,1);
/*!40000 ALTER TABLE `walk` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `walk_alert_request`
--

DROP TABLE IF EXISTS `walk_alert_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `walk_alert_request` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `walk_id` int(11) DEFAULT NULL,
  `requested_at` datetime NOT NULL,
  `notified` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_629861CAA76ED395` (`user_id`),
  KEY `IDX_629861CA5EEE1B48` (`walk_id`),
  CONSTRAINT `FK_629861CA5EEE1B48` FOREIGN KEY (`walk_id`) REFERENCES `walk` (`id`),
  CONSTRAINT `FK_629861CAA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `walk_alert_request`
--

LOCK TABLES `walk_alert_request` WRITE;
/*!40000 ALTER TABLE `walk_alert_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `walk_alert_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `walk_participants`
--

DROP TABLE IF EXISTS `walk_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `walk_participants` (
  `walk_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`walk_id`,`user_id`),
  KEY `IDX_FA8853E95EEE1B48` (`walk_id`),
  KEY `IDX_FA8853E9A76ED395` (`user_id`),
  CONSTRAINT `FK_FA8853E95EEE1B48` FOREIGN KEY (`walk_id`) REFERENCES `walk` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_FA8853E9A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `walk_participants`
--

LOCK TABLES `walk_participants` WRITE;
/*!40000 ALTER TABLE `walk_participants` DISABLE KEYS */;
INSERT INTO `walk_participants` VALUES (1,2),(2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(8,2),(9,2),(51,2),(52,2),(53,2),(54,2),(55,2);
/*!40000 ALTER TABLE `walk_participants` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-15  6:37:40
