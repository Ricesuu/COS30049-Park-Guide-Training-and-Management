-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2025 at 03:30 AM
-- Server version: 8.0.42
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `park_guide_management`
--

CREATE DATABASE IF NOT EXISTS park_guide_management;
USE park_guide_management;

-- --------------------------------------------------------
--
-- Table structure for table `activealerts`
--

CREATE TABLE `activealerts` (
  `alert_id` int NOT NULL,
  `park_id` int NOT NULL,
  `sensor_type` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `recorded_value` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `threshold_id` int NOT NULL,
  `message` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `severity` enum('low','medium','high') COLLATE utf8mb4_general_ci NOT NULL,
  `is_acknowledged` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `alertthresholds`
--

CREATE TABLE `alertthresholds` (
  `threshold_id` int NOT NULL,
  `sensor_type` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `park_id` int NOT NULL,
  `min_threshold` float DEFAULT NULL,
  `max_threshold` float DEFAULT NULL,
  `trigger_message` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `severity` enum('low','medium','high') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'medium',
  `is_enabled` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alertthresholds`
--

INSERT INTO `alertthresholds` (`threshold_id`, `sensor_type`, `park_id`, `min_threshold`, `max_threshold`, `trigger_message`, `severity`, `is_enabled`, `created_at`, `updated_at`) VALUES
(1, 'temperature', 1, 20, 32, 'Temperature threshold exceeded', 'medium', 1, '2025-05-15 02:38:38', '2025-05-15 02:38:38'),
(2, 'temperature', 2, 20, 32, 'Temperature threshold exceeded', 'medium', 1, '2025-05-15 02:38:38', '2025-05-15 02:38:38'),
(3, 'humidity', 1, 40, 80, 'Humidity threshold exceeded', 'medium', 1, '2025-05-15 02:38:38', '2025-05-15 02:38:38'),
(4, 'humidity', 2, 40, 80, 'Humidity threshold exceeded', 'medium', 1, '2025-05-15 02:38:38', '2025-05-15 02:38:38'),
(5, 'soil moisture', 1, 30, 31, 'Soil moisture threshold exceeded', 'high', 1, '2025-05-15 02:38:38', '2025-05-15 02:38:38'),
(6, 'soil moisture', 2, 30, 31, 'Soil moisture threshold exceeded', 'high', 1, '2025-05-15 02:38:38', '2025-05-15 02:38:38'),
(7, 'motion', 1, NULL, NULL, 'Unauthorized motion detected', 'high', 1, '2025-05-15 02:38:38', '2025-05-15 02:38:38'),
(8, 'motion', 2, NULL, NULL, 'Unauthorized motion detected', 'high', 1, '2025-05-15 02:38:38', '2025-05-15 02:38:38');

-- --------------------------------------------------------

--
-- Table structure for table `certifications`
--

CREATE TABLE `certifications` (
  `cert_id` int NOT NULL,
  `guide_id` int NOT NULL,
  `module_id` int NOT NULL,
  `issued_date` date NOT NULL,
  `expiry_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `guidebook`
--

CREATE TABLE `guidebook` (
  `guidebook_id` int NOT NULL,
  `park_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `multimedia_links` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guidebook`
--

INSERT INTO `guidebook` (`guidebook_id`, `park_id`, `title`, `content`, `multimedia_links`) VALUES
(1, 1, 'Exploring Bako National Park: A Visitor\'s Guide', 'Discover the diverse ecosystems, flora, and fauna of Bako National Park. Includes tips for hiking, wildlife spotting, and safety precautions.', 'bako_guide_video_links, bako_maps_links'),
(2, 2, 'Semenggoh Wildlife Centre: Orangutan Conservation and Visitor Tips', 'Learn about the history, mission, and highlights of Semenggoh Wildlife Centre, with tips for observing wildlife responsibly and engaging in conservation efforts.', 'semenggoh_video_links, semenggoh_facts_links');

-- --------------------------------------------------------
--
-- Table structure for table `guidetrainingprogress`
--

CREATE TABLE `guidetrainingprogress` (
  `progress_id` int NOT NULL,
  `guide_id` int NOT NULL,
  `module_id` int NOT NULL,
  `status` enum('in progress','Completed') COLLATE utf8mb4_general_ci DEFAULT 'in progress',
  `completion_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `iotmonitoring`
--

CREATE TABLE `iotmonitoring` (
  `sensor_id` int NOT NULL,
  `park_id` int NOT NULL,
  `sensor_type` enum('temperature','humidity','soil moisture','motion') COLLATE utf8mb4_general_ci NOT NULL,
  `recorded_value` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `iotmonitoring`
--

INSERT INTO `iotmonitoring` (`sensor_id`, `park_id`, `sensor_type`, `recorded_value`, `recorded_at`) VALUES
(1, 1, 'temperature', '24.5', '2025-05-14 16:38:38'),
(2, 1, 'temperature', '25.2', '2025-05-14 17:38:38'),
(3, 1, 'temperature', '26.8', '2025-05-14 18:38:38'),
(4, 1, 'temperature', '28.3', '2025-05-14 19:38:38'),
(5, 1, 'temperature', '29.5', '2025-05-14 20:38:38'),
(6, 1, 'temperature', '30.1', '2025-05-14 21:38:38'),
(7, 1, 'temperature', '30.2', '2025-05-14 22:38:38'),
(8, 1, 'temperature', '29.8', '2025-05-14 23:38:38'),
(9, 1, 'temperature', '28.5', '2025-05-15 00:38:38'),
(10, 1, 'temperature', '27.7', '2025-05-15 01:38:38'),
(11, 1, 'humidity', '75%', '2025-05-14 16:38:38'),
(12, 1, 'humidity', '72%', '2025-05-14 17:38:38'),
(13, 1, 'humidity', '68%', '2025-05-14 18:38:38'),
(14, 1, 'humidity', '65%', '2025-05-14 19:38:38'),
(15, 1, 'humidity', '62%', '2025-05-14 20:38:38'),
(16, 1, 'humidity', '60%', '2025-05-14 21:38:38'),
(17, 1, 'humidity', '61%', '2025-05-14 22:38:38'),
(18, 1, 'humidity', '64%', '2025-05-14 23:38:38'),
(19, 1, 'humidity', '68%', '2025-05-15 00:38:38'),
(20, 1, 'humidity', '71%', '2025-05-15 01:38:38');

-- --------------------------------------------------------
--
-- Table structure for table `modulepurchases`
--

CREATE TABLE `modulepurchases` (
  `purchase_id` int NOT NULL,
  `user_id` int NOT NULL,
  `module_id` int NOT NULL,
  `payment_id` int NOT NULL,
  `purchase_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `status` enum('pending','active','revoked') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `modulepurchases`
--
DELIMITER $$
CREATE TRIGGER `after_module_purchase_creation` AFTER INSERT ON `modulepurchases` FOR EACH ROW BEGIN
  DECLARE guide_id INT;
  
  -- Find guide_id for the user who purchased the module
  SELECT pg.guide_id INTO guide_id
  FROM ParkGuides pg
  WHERE pg.user_id = NEW.user_id
  LIMIT 1;
  
  -- If guide_id found, insert a record into GuideTrainingProgress
  IF guide_id IS NOT NULL THEN
    INSERT IGNORE INTO GuideTrainingProgress
      (guide_id, module_id, status, start_date)
    VALUES
      (guide_id, NEW.module_id, 'in progress', CURRENT_DATE());
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `multilicensetrainingexemptions`
--

CREATE TABLE `multilicensetrainingexemptions` (
  `exemption_id` int NOT NULL,
  `guide_id` int NOT NULL,
  `training_id` int NOT NULL,
  `exempted_training_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `options`
--

CREATE TABLE `options` (
  `options_id` int NOT NULL,
  `question_id` int NOT NULL,
  `text` varchar(255) NOT NULL,
  `is_correct` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `options`
--

INSERT INTO `options` (`options_id`, `question_id`, `text`, `is_correct`, `created_at`, `updated_at`) VALUES
(1, 1, 'To educate visitors about the flora and fauna of the park.', 1, NOW(), NOW()),
(2, 1, 'To enforce park rules and regulations.', 0, NOW(), NOW()),
(3, 1, 'To provide transportation within the park.', 0, NOW(), NOW()),
(4, 1, 'To sell souvenirs to visitors.', 0, NOW(), NOW()),

(5, 2, 'Spider Lily', 1, NOW(), NOW()),
(6, 2, 'Rose', 0, NOW(), NOW()),
(7, 2, 'Tulip', 0, NOW(), NOW()),
(8, 2, 'Sunflower', 0, NOW(), NOW()),

(9, 3, 'True', 0, NOW(), NOW()),
(10, 3, 'False', 1, NOW(), NOW()),

(11, 4, 'Interactive storytelling', 1, NOW(), NOW()),
(12, 4, 'Reading from a script', 0, NOW(), NOW()),
(13, 4, 'Ignoring visitor questions', 0, NOW(), NOW()),
(14, 4, 'Walking silently', 0, NOW(), NOW()),

(15, 5, 'True', 1, NOW(), NOW()),
(16, 5, 'False', 0, NOW(), NOW()),

(17, 6, 'Try to involve the visitor by relating information to their interests.', 1, NOW(), NOW()),
(18, 6, 'Ignore the visitor.', 0, NOW(), NOW()),
(19, 6, 'End the tour early.', 0, NOW(), NOW()),
(20, 6, 'Speak louder.', 0, NOW(), NOW()),

(21, 7, 'Rafflesia', 1, NOW(), NOW()),
(22, 7, 'Cattleya Orchid', 0, NOW(), NOW()),
(23, 7, 'Spider Lily', 0, NOW(), NOW()),
(24, 7, 'Epiphyllum oxypetalum', 0, NOW(), NOW()),

(25, 8, 'True', 1, NOW(), NOW()),
(26, 8, 'False', 0, NOW(), NOW()),

(27, 9, 'Epiphyllum oxypetalum', 1, NOW(), NOW()),
(28, 9, 'Cattleya Orchid', 0, NOW(), NOW()),
(29, 9, 'Rafflesia', 0, NOW(), NOW()),
(30, 9, 'Spider Lily', 0, NOW(), NOW()),

(31, 10, 'Time management', 1, NOW(), NOW()),
(32, 10, 'Cooking skills', 0, NOW(), NOW()),
(33, 10, 'Drawing maps', 0, NOW(), NOW()),
(34, 10, 'Bird watching', 0, NOW(), NOW()),

(35, 11, 'True', 1, NOW(), NOW()),
(36, 11, 'False', 0, NOW(), NOW()),

(37, 12, 'A checklist', 1, NOW(), NOW()),
(38, 12, 'A whistle', 0, NOW(), NOW()),
(39, 12, 'A camera', 0, NOW(), NOW()),
(40, 12, 'A map', 0, NOW(), NOW()),

(41, 13, 'Stay calm and keep a safe distance from the animal.', 1, NOW(), NOW()),
(42, 13, 'Approach the animal for a closer look.', 0, NOW(), NOW()),
(43, 13, 'Feed the animal.', 0, NOW(), NOW()),
(44, 13, 'Run away quickly.', 0, NOW(), NOW()),

(45, 14, 'True', 0, NOW(), NOW()),
(46, 14, 'False', 1, NOW(), NOW()),

(47, 15, 'First aid kit', 1, NOW(), NOW()),
(48, 15, 'Camera', 0, NOW(), NOW()),
(49, 15, 'Guidebook', 0, NOW(), NOW()),
(50, 15, 'Sunscreen', 0, NOW(), NOW());


-- --------------------------------------------------------
--
-- Table structure for table `paymenttransactions`
--

CREATE TABLE `paymenttransactions` (
  `payment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `uid` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `paymentPurpose` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `paymentMethod` enum('debit','credit','e_wallet') COLLATE utf8mb4_general_ci NOT NULL,
  `amountPaid` decimal(10,2) NOT NULL,
  `receipt_image` longblob NOT NULL,
  `paymentStatus` enum('pending','approved','rejected') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `transaction_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `module_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- ------------------------------------------------------------
--
-- Triggers `paymenttransactions`
--
DELIMITER $$
CREATE TRIGGER `after_payment_approval` AFTER UPDATE ON `paymenttransactions` FOR EACH ROW BEGIN
  IF NEW.paymentStatus = 'approved' AND OLD.paymentStatus = 'pending' AND NEW.module_id IS NOT NULL THEN
    -- Update module purchase status
    UPDATE ModulePurchases
    SET status = 'active'
    WHERE payment_id = NEW.payment_id;
    
    -- Update existing training progress record instead of creating a new one
    UPDATE GuideTrainingProgress gtp
    JOIN ModulePurchases mp ON mp.payment_id = NEW.payment_id
    JOIN Users u ON mp.user_id = u.user_id
    JOIN ParkGuides pg ON u.user_id = pg.user_id
    SET gtp.status = 'in progress'
    WHERE gtp.guide_id = pg.guide_id 
    AND gtp.module_id = NEW.module_id;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `pendingmodulepayments`
-- (See below for the actual view)
--
CREATE TABLE `pendingmodulepayments` (
`payment_id` int
,`user_id` int
,`user_name` varchar(511)
,`email` varchar(255)
,`module_id` int
,`module_name` varchar(255)
,`amountPaid` decimal(10,2)
,`paymentMethod` enum('debit','credit','e_wallet')
,`transaction_date` timestamp
);

-- --------------------------------------------------------

--
-- Table structure for table `plantinfo`
--

CREATE TABLE IF NOT EXISTS plants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scientific_name VARCHAR(255) NOT NULL,
    common_name VARCHAR(255),
    local_name VARCHAR(255),
    family VARCHAR(100),
    genus VARCHAR(100),
    species VARCHAR(100),
    description TEXT,
    habitat VARCHAR(255),
    uses VARCHAR(255),
    toxicity VARCHAR(100),
    image_url VARCHAR(2083),
    leaf_type VARCHAR(100),
    flower_color VARCHAR(100),
    fruit_type VARCHAR(100),
    growth_form VARCHAR(100),
    distribution VARCHAR(255),
    conservation_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Info of the plants
INSERT INTO plants (
    scientific_name, common_name, local_name, family, genus, species,
    description, habitat, uses, toxicity, image_url,
    leaf_type, flower_color, fruit_type, growth_form, distribution,
    conservation_status
)
VALUES
('Angraecum', 'Angraecum orchid', 'Orkid Angraecum', 'Orchidaceae', 'Angraecum', '', 'Epiphytic orchid with star-shaped flowers.', 'Tropical forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'White', 'None', 'Epiphyte', 'Madagascar, Africa', 'Least Concern'),

('Arundina graminifolia', 'Bamboo orchid', 'Orkid Buluh', 'Orchidaceae', 'Arundina', 'graminifolia', 'Terrestrial orchid resembling bamboo.', 'Hillsides, grasslands', 'Ornamental', 'Non-toxic', '', 'Deciduous', 'Pink', 'Capsule', 'Terrestrial', 'Southeast Asia', 'Least Concern'),

('Brassavola', 'Brassavola orchid', 'Orkid Brassavola', 'Orchidaceae', 'Brassavola', '', 'Fragrant night-blooming orchids.', 'Lowland tropical forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'White', 'Capsule', 'Epiphyte', 'Central and South America', 'Least Concern'),

('Brassia', 'Spider orchid', 'Orkid Labah-labah', 'Orchidaceae', 'Brassia', '', 'Long-petaled orchid resembling spiders.', 'Humid forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'Yellow-brown', 'Capsule', 'Epiphyte', 'Central America', 'Least Concern'),

('Cattleya', 'Cattleya orchid', 'Orkid Cattleya', 'Orchidaceae', 'Cattleya', '', 'Showy orchids used in corsages.', 'Cloud forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'Purple', 'Capsule', 'Epiphyte', 'South America', 'Least Concern'),

('Coelogyne asperata', 'Coelogyne orchid', 'Orkid Coelogyne', 'Orchidaceae', 'Coelogyne', 'asperata', 'Large fragrant orchid with pale flowers.', 'Rainforests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'Cream', 'Capsule', 'Epiphyte', 'Southeast Asia', 'Least Concern'),

('Cymbidium', 'Cymbidium orchid', 'Orkid Cymbidium', 'Orchidaceae', 'Cymbidium', '', 'Popular cool-growing orchids.', 'Montane forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'Various', 'Capsule', 'Terrestrial', 'Asia, Australia', 'Least Concern'),

('Dendrobium', 'Dendrobium orchid', 'Orkid Dendrobium', 'Orchidaceae', 'Dendrobium', '', 'Large genus with diverse forms.', 'Forests and grasslands', 'Medicinal, ornamental', 'Non-toxic', '', 'Deciduous', 'White, Purple', 'Capsule', 'Epiphyte', 'Asia-Pacific', 'Least Concern'),

('Encyclia', 'Encyclia orchid', 'Orkid Encyclia', 'Orchidaceae', 'Encyclia', '', 'Pseudobulbous orchid with ruffled flowers.', 'Dry forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'Brown, Green', 'Capsule', 'Epiphyte', 'Americas', 'Least Concern'),

('Epidendrum', 'Epidendrum orchid', 'Orkid Epidendrum', 'Orchidaceae', 'Epidendrum', '', 'Reed-stemmed orchids with vibrant blooms.', 'Tropical forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'Orange, Pink', 'Capsule', 'Epiphyte', 'Americas', 'Least Concern'),

('Lycaste', 'Lycaste orchid', 'Orkid Lycaste', 'Orchidaceae', 'Lycaste', '', 'Orchid with triangular flowers.', 'Cloud forests', 'Ornamental', 'Non-toxic', '', 'Deciduous', 'Green, Yellow', 'Capsule', 'Epiphyte', 'Central and South America', 'Least Concern'),

('Masdevallia', 'Masdevallia orchid', 'Orkid Masdevallia', 'Orchidaceae', 'Masdevallia', '', 'Orchid with short-lived but striking flowers.', 'Cloud forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'Red, Orange', 'Capsule', 'Epiphyte', 'South America', 'Least Concern'),

('Maxillaria', 'Maxillaria orchid', 'Orkid Maxillaria', 'Orchidaceae', 'Maxillaria', '', 'Diverse orchid genus with various flower shapes.', 'Tropical forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'Yellow', 'Capsule', 'Epiphyte', 'Americas', 'Least Concern'),

('Miltonia', 'Miltonia orchid', 'Orkid Miltonia', 'Orchidaceae', 'Miltonia', '', 'Pansy-like flowers, often fragrant.', 'Tropical forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'White, Purple', 'Capsule', 'Epiphyte', 'Brazil', 'Least Concern'),

('Miltoniopsis', 'Miltoniopsis orchid', 'Orkid Miltoniopsis', 'Orchidaceae', 'Miltoniopsis', '', 'Cool-growing orchids with large flowers.', 'Cloud forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'Pink, White', 'Capsule', 'Epiphyte', 'South America', 'Least Concern'),

('Odontoglossum', 'Odontoglossum orchid', 'Orkid Odontoglossum', 'Orchidaceae', 'Odontoglossum', '', 'Cool-climate orchids with spotted flowers.', 'High altitude forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'Various', 'Capsule', 'Epiphyte', 'Andes', 'Least Concern'),

('Oncidium', 'Dancing Lady orchid', 'Orkid Menari', 'Orchidaceae', 'Oncidium', '', 'Distinctive dancing flowers.', 'Forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'Yellow, Brown', 'Capsule', 'Epiphyte', 'Americas', 'Least Concern'),

('Paphiopedilum', 'Lady\'s Slipper orchid', 'Orkid Selipar Wanita', 'Orchidaceae', 'Paphiopedilum', '', 'Pouch-like flowers, terrestrial.', 'Limestone forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'Green, White', 'Capsule', 'Terrestrial', 'Asia', 'Vulnerable'),

('Phalaenopsis', 'Moth orchid', 'Orkid Rama-rama', 'Orchidaceae', 'Phalaenopsis', '', 'Popular houseplant with long-lasting flowers.', 'Lowland forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'White, Pink', 'Capsule', 'Epiphyte', 'Asia, Australia', 'Least Concern'),

('Paphiopedilum stonei', 'Stone\'s slipper orchid', 'Orkid Batu', 'Orchidaceae', 'Paphiopedilum', 'stonei', 'Rare species with long petals.', 'Rocky limestone areas', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'White, Brown', 'Capsule', 'Terrestrial', 'Borneo', 'Endangered'),

('Spathoglottis plicata', 'Ground orchid', 'Orkid Tanah', 'Orchidaceae', 'Spathoglottis', 'plicata', 'Common terrestrial orchid with showy flowers.', 'Open grasslands', 'Ornamental', 'Non-toxic', '', 'Deciduous', 'Purple', 'Capsule', 'Terrestrial', 'Tropics', 'Least Concern'),

('Vanda', 'Vanda orchid', 'Orkid Vanda', 'Orchidaceae', 'Vanda', '', 'Large, showy tropical orchids.', 'Lowland forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'Blue, Purple', 'Capsule', 'Epiphyte', 'Asia, Australia', 'Least Concern'),

('Vanilla', 'Vanilla orchid', 'Orkid Vanila', 'Orchidaceae', 'Vanilla', '', 'Source of natural vanilla flavor.', 'Tropical forests', 'Culinary, ornamental', 'Non-toxic', '', 'Evergreen', 'Greenish-white', 'Capsule', 'Vine', 'Tropics', 'Least Concern'),

('Zygopetalum', 'Zygopetalum orchid', 'Orkid Zygopetalum', 'Orchidaceae', 'Zygopetalum', '', 'Fragrant, waxy flowers.', 'Cloud forests', 'Ornamental', 'Non-toxic', '', 'Evergreen', 'Green, Purple', 'Capsule', 'Epiphyte', 'South America', 'Least Concern');


CREATE TABLE `plantinfo` (
  `plant_id` int NOT NULL,
  `common_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `scientific_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `family` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plantinfo`
--

INSERT INTO `plantinfo` (`plant_id`, `common_name`, `scientific_name`, `family`, `description`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 'Spider Lily', 'Hymenocallis littoralis', 'Amaryllidaceae', 'The Spider Lily is a stunning tropical plant known for its elegant, spider-like white flowers with long, delicate petals. Native to tropical regions, it thrives in warm, humid environments and produces fragrant blooms throughout the growing season. The plant plays an important role in local ecosystems and is valued for both its ornamental beauty and cultural significance.', 'https://en.whu.edu.cn/__local/E/BB/0A/C72D750AC39F58D1F4DD1D85605_070A1AAE_7F0E.jpg', '2025-05-22 18:25:25', '2025-05-22 18:25:25'),
(2, 'Night Queen of Flowers', 'Epiphyllum oxypetalum', 'Cactaceae', 'The Night Queen of Flowers, also known as the Queen of the Night, is a spectacular nocturnal blooming cactus. This epiphytic cactus produces large, white, highly fragrant flowers that bloom only at night and wilt by dawn. Each flower can reach up to 30 cm in length, making it one of the most impressive night-blooming plants in our collection. Its rare blooming pattern and ethereal beauty make it a highly sought-after specimen in botanical gardens.', 'https://www.southsideblooms.com/wp-content/uploads/2022/05/NightQueenofFlowers.jpg', '2025-05-22 18:25:25', '2025-05-22 18:25:25'),
(3, 'Rafflesia', 'Rafflesia arnoldii', 'Rafflesiaceae', 'Known as the corpse flower, the Rafflesia is the largest individual flower in the world and is native to the rainforests of Borneo. This parasitic plant produces massive blooms that can reach up to 3 feet in diameter. The flower is famous for its distinctive appearance and its strong odor, which attracts pollinators. Despite its size and significance, the Rafflesia has no stems, leaves, or roots, making it one of the most unique specimens in our botanical collection.', 'https://cdn.shortpixel.ai/spai2/q_glossy+w_1082+to_auto+ret_img/www.fauna-flora.org/wp-content/uploads/2023/06/our-green-planet-resplendent-rafflesia-reigns-supreme-scaled.jpg', '2025-05-22 18:25:25', '2025-05-22 18:25:25'),
(4, 'Cattleya Orchid', 'Cattleya labiata', 'Orchidaceae', 'The Cattleya Orchid, often referred to as the \"Queen of Orchids,\" is renowned for its large, showy blooms and intense fragrance. Native to tropical Americas, these epiphytic orchids produce spectacular flowers in shades of purple, pink, and white, often with frilled lips and intricate patterns. Each bloom can last several weeks, and the plants typically flower once or twice a year. In our collection, these orchids demonstrate the incredible diversity of the orchid family and serve as stunning examples of tropical flora adaptation.', 'https://www.better-gro.com/uploads/1/0/3/0/103066208/shutterstock-199188980-e1428327243456_orig.jpg', '2025-05-22 18:25:25', '2025-05-22 18:25:25');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `question_id` int NOT NULL,
  `quiz_id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `text` text NOT NULL,
  `explanation` text,
  `points` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`question_id`, `quiz_id`, `type`, `text`, `explanation`, `points`, `created_at`, `updated_at`) VALUES
-- Park Guide Basics Quiz (quiz_id = 1)
(1, 1, 'multiple_choice', 'What is the primary purpose of the park guide?', 'The primary purpose of the park guide is to educate visitors about the flora and fauna of the park.', 1, '2025-05-22 19:24:04', '2025-05-22 19:24:04'),
(2, 1, 'multiple_choice', 'Which of the following is a common plant found in the park?', 'The Spider Lily is a common plant found in the park.', 1, '2025-05-22 19:24:04', '2025-05-22 19:24:04'),
(3, 1, 'true_false', 'The Night Queen of Flowers blooms during the day.', 'False. The Night Queen of Flowers blooms at night.', 1, '2025-05-22 19:24:04', '2025-05-22 19:24:04'),

-- Visitor Engagement Techniques Quiz (quiz_id = 2)
(4, 2, 'multiple_choice', 'Which technique is most effective for engaging visitors during a tour?', 'Interactive storytelling is an effective technique for engaging visitors.', 1, '2025-05-22 19:25:00', '2025-05-22 19:25:00'),
(5, 2, 'multiple_choice', 'True or False: Asking open-ended questions helps encourage visitor participation.', 'True. Open-ended questions promote discussion and engagement.', 1, '2025-05-22 19:25:00', '2025-05-22 19:25:00'),
(6, 2, 'multiple_choice', 'What should a guide do if a visitor seems uninterested?', 'A guide should try to involve the visitor by relating information to their interests.', 1, '2025-05-22 19:25:00', '2025-05-22 19:25:00'),

-- Flora and Fauna Identification Quiz (quiz_id = 3)
(7, 3, 'multiple_choice', 'Which plant is known as the "corpse flower"?', 'Rafflesia is known as the corpse flower.', 1, '2025-05-22 19:26:00', '2025-05-22 19:26:00'),
(8, 3, 'true_false', 'The Cattleya Orchid is native to tropical Americas.', 'True. The Cattleya Orchid is native to tropical Americas.', 1, '2025-05-22 19:26:00', '2025-05-22 19:26:00'),
(9, 3, 'multiple_choice', 'Which of the following is a nocturnal blooming cactus?', 'Epiphyllum oxypetalum is a nocturnal blooming cactus.', 1, '2025-05-22 19:26:00', '2025-05-22 19:26:00'),

-- Organization Skills for Guides Quiz (quiz_id = 4)
(10, 4, 'multiple_choice', 'What is an essential skill for organizing a successful tour?', 'Time management is essential for organizing a successful tour.', 1, '2025-05-22 19:27:00', '2025-05-22 19:27:00'),
(11, 4, 'true_false', 'A guide should always have a backup plan for outdoor activities.', 'True. Having a backup plan is important for handling unexpected situations.', 1, '2025-05-22 19:27:00', '2025-05-22 19:27:00'),
(12, 4, 'multiple_choice', 'Which tool can help a guide keep track of group members during a tour?', 'A checklist can help a guide keep track of group members.', 1, '2025-05-22 19:27:00', '2025-05-22 19:27:00'),

-- Safety Awareness Basics Quiz (quiz_id = 5)
(13, 5, 'multiple_choice', 'What should you do if you encounter a wild animal during a tour?', 'Stay calm and keep a safe distance from the animal.', 1, '2025-05-22 19:28:00', '2025-05-22 19:28:00'),
(14, 5, 'true_false', 'It is safe to leave the designated trail in a national park.', 'False. Leaving the designated trail can be dangerous and is not recommended.', 1, '2025-05-22 19:28:00', '2025-05-22 19:28:00'),
(15, 5, 'multiple_choice', 'Which item is essential for a guide to carry for safety?', 'A first aid kit is essential for safety during tours.', 1, '2025-05-22 19:28:00', '2025-05-22 19:28:00');

-- --------------------------------------------------------

--
-- Table structure for table `quizattempts`
--

CREATE TABLE `quizattempts` (
  `attempt_id` int NOT NULL,
  `quiz_id` int NOT NULL,
  `user_id` int NOT NULL,
  `guide_id` int NOT NULL,
  `module_id` int NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_time` timestamp NULL DEFAULT NULL,
  `score` int DEFAULT NULL,
  `totalquestions` int DEFAULT NULL,
  `passed` tinyint(1) DEFAULT NULL,
  `attempt_number` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `quizattempts`
--
DELIMITER $$
CREATE TRIGGER `after_quiz_completion` AFTER UPDATE ON `quizattempts` FOR EACH ROW BEGIN
  DECLARE module_id_val INT;
  
  IF NEW.passed = TRUE AND (OLD.passed IS NULL OR OLD.passed = FALSE) THEN
    -- Get the module_id for this quiz
    SELECT module_id INTO module_id_val FROM Quizzes WHERE quiz_id = NEW.quiz_id;
    
    -- Update module progress
    UPDATE GuideTrainingProgress 
    SET status = 'Completed', completion_date = CURDATE()
    WHERE guide_id = NEW.guide_id AND module_id = module_id_val;
    
    -- If progress record doesn't exist, create it
    IF ROW_COUNT() = 0 THEN
      INSERT INTO GuideTrainingProgress (guide_id, module_id, status, completion_date)
      VALUES (NEW.guide_id, module_id_val, 'Completed', CURDATE());
    END IF;
    
    -- Also update completion percentage in ModulePurchases
    UPDATE ModulePurchases mp
    JOIN Users u ON u.user_id = mp.user_id
    JOIN ParkGuides pg ON pg.user_id = u.user_id
    SET mp.completion_percentage = 100.00
    WHERE pg.guide_id = NEW.guide_id AND mp.module_id = module_id_val;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `quizresponses`
--

CREATE TABLE `quizresponses` (
  `response_id` int NOT NULL,
  `attempt_id` int NOT NULL,
  `question_id` int NOT NULL,
  `selected_option_id` int NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `time_taken` int DEFAULT NULL,
  `points_earned` int NOT NULL DEFAULT '0',
  `answer_changed` tinyint(1) DEFAULT '0',
  `answer_sequence` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `quiz_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`quiz_id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Park Guide Basics Quiz', 'Quiz for the Park Guide Basics module.', '2025-05-22 18:25:25', '2025-05-22 18:25:25'),
(2, 'Visitor Engagement Techniques Quiz', 'Quiz for the Visitor Engagement Techniques module.', '2025-05-22 18:25:25', '2025-05-22 18:25:25'),
(3, 'Flora and Fauna Identification Quiz', 'Quiz for the Flora and Fauna Identification module.', '2025-05-22 18:25:25', '2025-05-22 18:25:25'),
(4, 'Organization Skills for Guides Quiz', 'Quiz for the Organization Skills for Guides module.', '2025-05-22 18:25:25', '2025-05-22 18:25:25'),
(5, 'Safety Awareness Basics Quiz', 'Quiz for the Safety Awareness Basics module.', '2025-05-22 18:25:25', '2025-05-22 18:25:25');

-- --------------------------------------------------------

--
-- Table structure for table `trainingmodules`
--

CREATE TABLE `trainingmodules` (
  `module_id` int NOT NULL,
  `module_code` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `module_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `difficulty` enum('beginner','intermediate','advanced') COLLATE utf8mb4_general_ci NOT NULL,
  `aspect` enum('language','knowledge','organization','engagement','safety') COLLATE utf8mb4_general_ci NOT NULL,
  `video_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `course_content` longtext COLLATE utf8mb4_general_ci,
  `quiz_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `is_compulsory` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trainingmodules`
--

INSERT INTO `trainingmodules` (`module_id`, `module_code`, `module_name`, `description`, `difficulty`, `aspect`, `video_url`, `course_content`, `quiz_id`, `created_at`, `price`, `is_compulsory`) VALUES
(1, 'PKG101', 'Park Guide Basics', 'Introduction to the role and responsibilities of a park guide.', 'beginner', 'knowledge', 'https://www.youtube.com/watch?v=3fumBcKC6RE', 'This module covers the basics of being a park guide, including responsibilities and expectations.', 1, '2025-05-22 18:25:25', 100.00, 1),
(2, 'ENG201', 'Visitor Engagement Techniques', 'Effective techniques for engaging with park visitors.', 'intermediate', 'engagement', 'https://www.youtube.com/watch?v=3fumBcKC6RE', 'Learn effective techniques for engaging with park visitors.', 2, '2025-05-22 18:25:25', 100.00, 1),
(3, 'KNW102', 'Flora and Fauna Identification', 'Identifying local flora and fauna in the park.', 'beginner', 'knowledge', 'https://www.youtube.com/watch?v=3GwjfUFyY6M', 'This module focuses on identifying local flora and fauna in the park.', 1, '2025-05-22 18:25:25', 0.00, 0),
(4, 'ORG102', 'Organization Skills for Guides', 'Essential skills for organizing tours and activities.', 'intermediate', 'organization', 'https://www.youtube.com/watch?v=2Z4m4lnjxkY', 'Learn essential organization skills for planning and executing tours.', 2, '2025-05-22 18:25:25', 0.00, 0),
(5, 'SAF101', 'Safety Awareness Basics', 'Introduction to safety awareness in outdoor environments.', 'beginner', 'safety', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'This module covers the basics of safety awareness in outdoor environments.', 1, '2025-05-22 18:25:25', 0.00, 0);


-- ----------------------------------------------------------
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `uid` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','park_guide') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'park_guide',
  `status` enum('pending','approved','rejected','deleted') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `failed_attempts` int DEFAULT '0',
  `last_failed_attempt` datetime DEFAULT NULL,
  `locked_until` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `uid`, `email`, `first_name`, `last_name`, `role`, `status`, `failed_attempts`, `last_failed_attempt`, `locked_until`, `created_at`, `deleted_at`) VALUES
(1, 'vTJ6RpxoDeOP83TKZZjONPyUhX13', 'theadmin@gmail.com', 'Admin', 'Wong', 'admin', 'approved', 0, NULL, NULL, '2025-05-15 02:38:38', NULL),
(2, 'ajxMEqjwGJROneaRDLFFIBisL8b2', 'parkguide@gmail.com', 'John', 'Doe', 'park_guide', 'approved', 0, NULL, NULL, '2025-05-15 06:31:20', NULL);

-- --------------------------------------------------------
--
-- Table structure for table `parks`
--

CREATE TABLE `parks` (
  `park_id` int NOT NULL,
  `park_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `location` text COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `wildlife` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parks`
--

INSERT INTO `parks` (`park_id`, `park_name`, `location`, `description`, `wildlife`) VALUES
(1, 'Bako National Park', 'Sarawak, Malaysia', 'Bako National Park is known for its diverse ecosystems, ranging from mangroves to rainforest, and its stunning coastline.', 'Proboscis monkeys, bearded pigs, otters, and various bird species'),
(2, 'Semenggoh Wildlife Centre', 'Kuching, Sarawak, Malaysia', 'Semenggoh Wildlife Centre is a sanctuary for rehabilitated orangutans, providing visitors with a chance to observe these magnificent creatures in their natural habitat.', 'Orangutans, gibbons, crocodiles, and local birdlife');

-- --------------------------------------------------------
--
-- Table structure for table `parkguides`
--

CREATE TABLE `parkguides` (
  `guide_id` int NOT NULL,
  `user_id` int NOT NULL,
  `certification_status` enum('not applicable','pending','certified','expired') DEFAULT 'not applicable',
  `license_expiry_date` date DEFAULT NULL,
  `assigned_park` varchar(255) DEFAULT NULL,
  `requested_park_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `parkguides` (`guide_id`, `user_id`, `certification_status`, `license_expiry_date`, `assigned_park`, `requested_park_id`) VALUES
(1, 2, 'not applicable', NULL, NULL, NULL);

-- --------------------------------------------------------
--
-- Table structure for table `visitorfeedback`
--

CREATE TABLE `visitorfeedback` (
  `feedback_id` int NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `ticket_no` varchar(50) NOT NULL,
  `park` varchar(255) NOT NULL,
  `visit_date` date NOT NULL,
  `guide_id` int NOT NULL,
  `language_rating` int NOT NULL,
  `knowledge_rating` int NOT NULL,
  `organization_rating` int NOT NULL,
  `engagement_rating` int NOT NULL,
  `safety_rating` int NOT NULL,
  `comment` text,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `visitorfeedback`
--

INSERT INTO `visitorfeedback` (`feedback_id`, `first_name`, `last_name`, `telephone`, `email`, `ticket_no`, `park`, `visit_date`, `guide_id`, `language_rating`, `knowledge_rating`, `organization_rating`, `engagement_rating`, `safety_rating`, `comment`, `submitted_at`) VALUES
(1, 'John', 'Smith', '+60123456789', 'john.smith@email.com', 'SW10001', 'Semenggoh Wildlife Centre', '2025-05-15', 1, 5, 4, 5, 5, 4, 'Excellent experience! The guide was very knowledgeable about orangutans and made the tour engaging.', '2025-05-22 18:25:25'),
(2, 'Emma', 'Johnson', '+60187654321', 'emma.j@email.com', 'SW10002', 'Semenggoh Wildlife Centre', '2025-05-18', 1, 4, 5, 4, 5, 5, 'Very informative tour. The safety briefing was thorough and I felt secure throughout the visit.', '2025-05-22 18:25:25'),
(3, 'Raj', 'Patel', '+60192345678', 'raj.patel@email.com', 'SW10003', 'Semenggoh Wildlife Centre', '2025-05-19', 1, 5, 5, 4, 4, 5, 'Amazing experience watching the orangutans. The guide was very professional and answered all our questions.', '2025-05-22 18:25:25'),
(4, 'Maria', 'Garcia', '+60176543210', 'maria.g@email.com', 'SW10004', 'Semenggoh Wildlife Centre', '2025-05-20', 1, 4, 5, 5, 5, 5, 'Outstanding tour! The guide was passionate about wildlife conservation and made the experience memorable.', '2025-05-22 18:25:25');

-- --------------------------------------------------------
--
-- Views
--

-- View for module progress by guide
CREATE OR REPLACE VIEW ModuleProgressByGuide AS
SELECT 
    pg.guide_id,
    u.first_name,
    u.last_name,
    tm.module_name,
    gtp.status as training_status,
    gtp.completion_date,
    CASE 
        WHEN c.cert_id IS NOT NULL AND c.expiry_date > CURDATE() THEN 'Valid'
        WHEN c.cert_id IS NOT NULL AND c.expiry_date <= CURDATE() THEN 'Expired'
        ELSE 'Not Certified'
    END as certification_status
FROM 
    parkguides pg
    JOIN users u ON pg.user_id = u.user_id
    JOIN guidetrainingprogress gtp ON pg.guide_id = gtp.guide_id
    JOIN trainingmodules tm ON gtp.module_id = tm.module_id
    LEFT JOIN certifications c ON pg.guide_id = c.guide_id AND tm.module_id = c.module_id;

-- View for active guide certifications
CREATE OR REPLACE VIEW ActiveGuideCertifications AS
SELECT 
    pg.guide_id,
    u.first_name,
    u.last_name,
    tm.module_name,
    c.issued_date,
    c.expiry_date,
    CASE 
        WHEN c.expiry_date > CURDATE() THEN 'Valid'
        ELSE 'Expired'
    END as status
FROM 
    parkguides pg
    JOIN users u ON pg.user_id = u.user_id
    JOIN certifications c ON pg.guide_id = c.guide_id
    JOIN trainingmodules tm ON c.module_id = tm.module_id
WHERE 
    c.expiry_date >= CURDATE();

-- View for park monitoring status
CREATE OR REPLACE VIEW ParkMonitoringStatus AS
SELECT 
    p.park_id,
    p.park_name,
    im.sensor_type,
    im.recorded_value,
    im.recorded_at,
    CASE 
        WHEN aa.alert_id IS NOT NULL THEN 'Alert'
        ELSE 'Normal'
    END as status,
    aa.severity,
    aa.message
FROM 
    parks p
    LEFT JOIN iotmonitoring im ON p.park_id = im.park_id
    LEFT JOIN activealerts aa ON p.park_id = aa.park_id AND im.sensor_type = aa.sensor_type;

-- --------------------------------------------------------

--
-- Indexes for table `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`cert_id`);

--
-- Indexes for table `guidetrainingprogress`
--
ALTER TABLE `guidetrainingprogress`
  ADD PRIMARY KEY (`progress_id`),
  ADD UNIQUE KEY `unique_guide_module` (`guide_id`,`module_id`),
  ADD KEY `module_id` (`module_id`);

--
-- Indexes for table `iotmonitoring`
--
ALTER TABLE `iotmonitoring`
  ADD PRIMARY KEY (`sensor_id`);

--
-- Indexes for table `modulepurchases`
--
ALTER TABLE `modulepurchases`
  ADD PRIMARY KEY (`purchase_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `module_id` (`module_id`),
  ADD KEY `payment_id` (`payment_id`);

--
-- Indexes for table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`options_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `parkguides`
--
ALTER TABLE `parkguides`
  ADD PRIMARY KEY (`guide_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `paymenttransactions`
--
ALTER TABLE `paymenttransactions`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `plantinfo`
--
ALTER TABLE `plantinfo`
  ADD PRIMARY KEY (`plant_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indexes for table `quizattempts`
--
ALTER TABLE `quizattempts`
  ADD PRIMARY KEY (`attempt_id`),
  ADD KEY `quiz_id` (`quiz_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `guide_id` (`guide_id`),
  ADD KEY `module_id` (`module_id`);

--
-- Indexes for table `quizresponses`
--
ALTER TABLE `quizresponses`
  ADD PRIMARY KEY (`response_id`),
  ADD UNIQUE KEY `unique_response` (`attempt_id`,`question_id`),
  ADD KEY `selected_option_id` (`selected_option_id`),
  ADD KEY `idx_quizresponses_attempt` (`attempt_id`),
  ADD KEY `idx_quizresponses_question` (`question_id`),
  ADD KEY `idx_quizresponses_correct` (`is_correct`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`quiz_id`);

--
-- Indexes for table `trainingmodules`
--
ALTER TABLE `trainingmodules`
  ADD PRIMARY KEY (`module_id`),
  ADD UNIQUE KEY `module_code` (`module_code`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `visitorfeedback`
--
ALTER TABLE `visitorfeedback`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `guide_id` (`guide_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `certifications`
--
ALTER TABLE `certifications`
  MODIFY `cert_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `guidetrainingprogress`
--
ALTER TABLE `guidetrainingprogress`
  MODIFY `progress_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `iotmonitoring`
--
ALTER TABLE `iotmonitoring`
  MODIFY `sensor_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `modulepurchases`
--
ALTER TABLE `modulepurchases`
  MODIFY `purchase_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `options`
--
ALTER TABLE `options`
  MODIFY `options_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `parkguides`
--
ALTER TABLE `parkguides`
  MODIFY `guide_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `paymenttransactions`
--
ALTER TABLE `paymenttransactions`
  MODIFY `payment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `plantinfo`
--
ALTER TABLE `plantinfo`
  MODIFY `plant_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `quizattempts`
--
ALTER TABLE `quizattempts`
  MODIFY `attempt_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=162;

--
-- AUTO_INCREMENT for table `quizresponses`
--
ALTER TABLE `quizresponses`
  MODIFY `response_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `quiz_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `trainingmodules`
--
ALTER TABLE `trainingmodules`
  MODIFY `module_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `visitorfeedback`
--
ALTER TABLE `visitorfeedback`
  MODIFY `feedback_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `guidetrainingprogress`
--
ALTER TABLE `guidetrainingprogress`
  ADD CONSTRAINT `guidetrainingprogress_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `parkguides` (`guide_id`),
  ADD CONSTRAINT `guidetrainingprogress_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `trainingmodules` (`module_id`);

--
-- Constraints for table `modulepurchases`
--
ALTER TABLE `modulepurchases`
  ADD CONSTRAINT `modulepurchases_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `modulepurchases_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `trainingmodules` (`module_id`),
  ADD CONSTRAINT `modulepurchases_ibfk_3` FOREIGN KEY (`payment_id`) REFERENCES `paymenttransactions` (`payment_id`);

--
-- Constraints for table `options`
--
ALTER TABLE `options`
  ADD CONSTRAINT `options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `parkguides`
--
ALTER TABLE `parkguides`
  ADD CONSTRAINT `parkguides_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `paymenttransactions`
--
ALTER TABLE `paymenttransactions`
  ADD CONSTRAINT `paymenttransactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`quiz_id`) ON DELETE CASCADE;

--
-- Constraints for table `quizattempts`
--
ALTER TABLE `quizattempts`
  ADD CONSTRAINT `quizattempts_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`quiz_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quizattempts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quizattempts_ibfk_3` FOREIGN KEY (`guide_id`) REFERENCES `parkguides` (`guide_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quizattempts_ibfk_4` FOREIGN KEY (`module_id`) REFERENCES `trainingmodules` (`module_id`) ON DELETE CASCADE;

--
-- Constraints for table `quizresponses`
--
ALTER TABLE `quizresponses`
  ADD CONSTRAINT `quizresponses_ibfk_1` FOREIGN KEY (`attempt_id`) REFERENCES `quizattempts` (`attempt_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quizresponses_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quizresponses_ibfk_3` FOREIGN KEY (`selected_option_id`) REFERENCES `options` (`options_id`) ON DELETE CASCADE;

--
-- Constraints for table `trainingmodules`
--
ALTER TABLE `trainingmodules`
  ADD CONSTRAINT `trainingmodules_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`quiz_id`) ON DELETE SET NULL;

--
-- Constraints for table `visitorfeedback`
--
ALTER TABLE `visitorfeedback`
  ADD CONSTRAINT `visitorfeedback_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `parkguides` (`guide_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `ApproveModulePayment` (IN `payment_id_param` INT)   BEGIN
    DECLARE payment_status_var ENUM('pending', 'approved', 'rejected');
    
    -- Check current payment status
    SELECT paymentStatus INTO payment_status_var
    FROM paymenttransactions
    WHERE payment_id = payment_id_param;
    
    IF payment_status_var = 'pending' THEN
        -- Update payment status to approved
        UPDATE paymenttransactions
        SET paymentStatus = 'approved'
        WHERE payment_id = payment_id_param;
        
        -- Return success message
        SELECT 
            'success' AS result, 
            'Payment approved successfully' AS message;
    ELSE
        -- Return error if payment is not in pending state
        SELECT 
            'error' AS result, 
            CONCAT('Cannot approve payment in ', payment_status_var, ' state') AS message;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetModuleQuizInfo` (IN `module_id_param` INT, IN `user_uid_param` VARCHAR(255))   BEGIN
    DECLARE user_id_var INT;
    
    -- Get user ID from UID
    SELECT user_id INTO user_id_var
    FROM users
    WHERE uid = user_uid_param;
    
    -- Get all quizzes for this module
    SELECT 
        q.quiz_id,
        q.title,
        q.description,
        q.pass_percentage,
        q.attempts_allowed,
        q.is_certification_quiz,
        MAX(qa.score) AS highest_score,
        CASE 
            WHEN MAX(CASE WHEN qa.passed = 1 THEN 1 ELSE 0 END) = 1 THEN 'passed'
            WHEN COUNT(qa.attempt_id) >= q.attempts_allowed THEN 'max_attempts_reached'
            WHEN COUNT(qa.attempt_id) > 0 THEN 'in_progress'
            ELSE 'not_attempted'
        END AS attempt_status,
        COUNT(qa.attempt_id) AS attempt_count
    FROM 
        quizzes q
        LEFT JOIN quizattempts qa ON q.quiz_id = qa.quiz_id AND qa.user_id = user_id_var
    WHERE 
        q.module_id = module_id_param
    GROUP BY 
        q.quiz_id, q.title, q.description, q.pass_percentage, q.attempts_allowed, q.is_certification_quiz;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserModuleStatus` (IN `user_uid` VARCHAR(255))   BEGIN
    -- Get user ID from UID
    DECLARE user_id_var INT;
    
    SELECT user_id INTO user_id_var
    FROM users
    WHERE uid = user_uid;
    
    -- If user exists, get module information
    IF user_id_var IS NOT NULL THEN
        -- Get all modules, with purchase status
        SELECT 
            tm.module_id,
            tm.module_name,
            tm.description,
            tm.price,
            tm.is_premium,
            CASE 
                WHEN mp.purchase_id IS NOT NULL THEN 'purchased'
                ELSE 'available'
            END AS purchase_status,
            IFNULL(mp.completion_percentage, 0) AS completion_percentage,
            IFNULL(mp.status, 'not_purchased') AS module_status,
            IFNULL(mp.purchase_date, NULL) AS purchase_date
        FROM 
            trainingmodules tm
            LEFT JOIN (
                SELECT mp.* 
                FROM modulepurchases mp 
                WHERE mp.user_id = user_id_var AND mp.is_active = 1
            ) mp ON tm.module_id = mp.module_id
        ORDER BY 
            tm.is_premium ASC, 
            tm.module_name ASC;
    ELSE
        -- If user doesn't exist, return empty result
        SELECT NULL AS module_id;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InitiateModulePurchase` (IN `user_uid_param` VARCHAR(255), IN `module_id_param` INT, IN `payment_method_param` ENUM('debit','credit','e_wallet'), IN `amount_paid_param` DECIMAL(10,2), IN `receipt_image_blob` LONGBLOB)   BEGIN
    DECLARE user_id_var INT;
    DECLARE payment_id_var INT;
    DECLARE already_purchased BOOLEAN DEFAULT FALSE;
    
    -- Transaction to ensure all operations succeed or fail together
    START TRANSACTION;
    
    -- Get user ID from UID
    SELECT user_id INTO user_id_var
    FROM users
    WHERE uid = user_uid_param;
    
    -- Check if user has already purchased the module
    SELECT COUNT(*) > 0 INTO already_purchased
    FROM modulepurchases
    WHERE user_id = user_id_var AND module_id = module_id_param AND is_active = 1;
    
    IF user_id_var IS NOT NULL AND NOT already_purchased THEN
        -- Create payment transaction record
        INSERT INTO paymenttransactions (
            user_id, 
            uid, 
            paymentPurpose, 
            paymentMethod, 
            amountPaid, 
            receipt_image, 
            paymentStatus,
            module_id
        ) VALUES (
            user_id_var,
            user_uid_param,
            'module_purchase',
            payment_method_param,
            amount_paid_param,
            receipt_image_blob,
            'pending',
            module_id_param
        );
        
        -- Get the inserted payment ID
        SET payment_id_var = LAST_INSERT_ID();
        
        -- Create module purchase record with pending status
        INSERT INTO modulepurchases (
            user_id,
            module_id,
            payment_id,
            status,
            is_active
        ) VALUES (
            user_id_var,
            module_id_param,
            payment_id_var,
            'pending',
            1
        );
        
        -- Return the payment ID for reference
        SELECT 
            'success' AS result,
            payment_id_var AS payment_id,
            'Module purchase initiated, payment pending approval' AS message;
        
        COMMIT;
    ELSE
        IF user_id_var IS NULL THEN
            SELECT 'error' AS result, 'User not found' AS message;
        ELSEIF already_purchased THEN
            SELECT 'error' AS result, 'Module already purchased by this user' AS message;
        END IF;
        
        ROLLBACK;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `RejectModulePayment` (IN `payment_id_param` INT, IN `rejection_reason` VARCHAR(255))   BEGIN
    DECLARE payment_status_var ENUM('pending', 'approved', 'rejected');
    
    -- Check current payment status
    SELECT paymentStatus INTO payment_status_var
    FROM paymenttransactions
    WHERE payment_id = payment_id_param;
    
    IF payment_status_var = 'pending' THEN
        -- Start transaction to ensure all operations succeed or fail together
        START TRANSACTION;
        
        -- Update payment status to rejected
        UPDATE paymenttransactions
        SET 
            paymentStatus = 'rejected'
        WHERE payment_id = payment_id_param;
        
        -- Update module purchase status to revoked
        UPDATE modulepurchases
        SET 
            status = 'revoked',
            is_active = 0
        WHERE payment_id = payment_id_param;
        
        COMMIT;
        
        -- Return success message
        SELECT 
            'success' AS result, 
            'Payment rejected successfully' AS message;
    ELSE
        -- Return error if payment is not in pending state
        SELECT 
            'error' AS result, 
            CONCAT('Cannot reject payment in ', payment_status_var, ' state') AS message;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateModuleCompletionPercentage` (IN `user_uid_param` VARCHAR(255), IN `module_id_param` INT, IN `completion_percentage_param` DECIMAL(5,2))   BEGIN
    DECLARE user_id_var INT;
    DECLARE module_purchase_exists BOOLEAN DEFAULT FALSE;
    
    -- Get user ID from UID
    SELECT user_id INTO user_id_var
    FROM users
    WHERE uid = user_uid_param;
    
    -- Check if user has purchased the module
    SELECT COUNT(*) > 0 INTO module_purchase_exists
    FROM modulepurchases
    WHERE user_id = user_id_var AND module_id = module_id_param AND is_active = 1 AND status = 'active';
    
    IF user_id_var IS NOT NULL AND module_purchase_exists THEN
        -- Update completion percentage
        UPDATE modulepurchases
        SET completion_percentage = completion_percentage_param
        WHERE user_id = user_id_var AND module_id = module_id_param AND is_active = 1;
        
        -- Return success message
        SELECT 
            'success' AS result, 
            'Module completion percentage updated successfully' AS message;
    ELSE
        IF user_id_var IS NULL THEN
            SELECT 'error' AS result, 'User not found' AS message;
        ELSEIF NOT module_purchase_exists THEN
            SELECT 'error' AS result, 'Active module purchase not found for this user' AS message;
        END IF;
    END IF;
END$$

DELIMITER ;