-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
-- -----------------------------------------------------
-- Schema groupomania
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema groupomania
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `groupomania` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
-- -----------------------------------------------------
-- Schema groupomania_production
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `groupomania_production` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
-- -----------------------------------------------------
-- Schema groupomania_test
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `groupomania_test` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
-- -----------------------------------------------------
USE `groupomania` ;

-- -----------------------------------------------------
-- Table `groupomania`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `groupomania`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `lastname` VARCHAR(255) NOT NULL,
  `firstname` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `bio` VARCHAR(255) NULL DEFAULT NULL,
  `imageProfile` VARCHAR(255) NULL DEFAULT NULL,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isAdmin` TINYINT(1) NULL DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'SsbHqIoS6UNfmjYbZMEfDw==','Admin','ADMIN','Admin','$2b$05$1AOkJ/i9XF6bhxqfvquft.tUIKO3wzaRQlU7UblKrUcTGkwkAdFYK',NULL,NULL,'2022-07-02 10:55:14',0,'2022-07-02 10:55:14');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


-- -----------------------------------------------------
-- Table `groupomania`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `groupomania`.`messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NULL DEFAULT NULL,
  `content` VARCHAR(600) NULL DEFAULT NULL,
  `attachment` VARCHAR(255) NULL DEFAULT NULL,
  `likes` INT NOT NULL DEFAULT '0',
  `userId` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `userId` (`userId` ASC) VISIBLE,
  CONSTRAINT `messages_ibfk_1`
    FOREIGN KEY (`userId`)
    REFERENCES `groupomania`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'Notifications aux Utilisateurs','Bienvenue sur Groupomania. Ici, vous pouvez partager des messages contenant un texte et une image. Vous pouvez réagir à d\'autres posts également en postant un Like !','http://localhost:3000/images/icon-above-font.png1656760443396.png',0,1,'2022-07-02 11:14:03','2022-07-02 11:14:03');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


-- -----------------------------------------------------
-- Table `groupomania`.`likes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `groupomania`.`likes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `messageId` INT NOT NULL,
  `userId` INT NOT NULL,
  `isLike` INT NOT NULL DEFAULT '1',
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `messageId` (`messageId` ASC) VISIBLE,
  INDEX `userId` (`userId` ASC) VISIBLE,
  CONSTRAINT `likes_ibfk_1`
    FOREIGN KEY (`messageId`)
    REFERENCES `groupomania`.`messages` (`id`),
  CONSTRAINT `likes_ibfk_2`
    FOREIGN KEY (`userId`)
    REFERENCES `groupomania`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `groupomania`.`sequelizemeta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `groupomania`.`sequelizemeta` (
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
