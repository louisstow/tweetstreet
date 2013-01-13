-- MySQL dump 10.13  Distrib 5.5.27, for osx10.7 (i386)
--
-- Host: localhost    Database: tweetdb
-- ------------------------------------------------------
-- Server version	5.5.27

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
-- Table structure for table `buying`
--

DROP TABLE IF EXISTS `buying`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buying` (
  `tradeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `stockID` varchar(100) NOT NULL,
  `buyerID` int(10) unsigned NOT NULL,
  `quantity` mediumint(8) unsigned NOT NULL,
  `cost` double(15,3) DEFAULT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`tradeID`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buying`
--

LOCK TABLES `buying` WRITE;
/*!40000 ALTER TABLE `buying` DISABLE KEYS */;
INSERT INTO `buying` VALUES (15,'mikehenrty',3,5,10.000,'2012-10-29 23:37:07'),(17,'mcav',2,1,35.000,'2012-10-30 21:25:39'),(21,'louisstow',2,7,55.000,'2012-11-02 23:35:31'),(23,'mikehenrty',2,100,20.007,'2012-11-10 11:53:10');
/*!40000 ALTER TABLE `buying` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `history` (
  `historyID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `stockID` varchar(100) NOT NULL,
  `buyerID` int(10) unsigned NOT NULL,
  `sellerID` int(10) unsigned NOT NULL,
  `quantity` mediumint(8) unsigned NOT NULL,
  `cost` double(15,3) DEFAULT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`historyID`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `history`
--

LOCK TABLES `history` WRITE;
/*!40000 ALTER TABLE `history` DISABLE KEYS */;
INSERT INTO `history` VALUES (1,'louisstow',2,1,1,413.631,'2012-10-24 20:00:17'),(2,'louisstow',2,1,2,413.631,'2012-10-24 20:03:17'),(3,'obama',2,1,2,0.000,'2012-10-25 23:31:08'),(4,'j_redp',2,1,1,2.560,'2012-10-27 18:45:55'),(5,'obama',2,1,1,0.000,'2012-10-27 19:10:44'),(6,'j_redp',2,1,10,2.560,'2012-10-27 19:11:15'),(7,'j_redp',3,2,1,1.560,'2012-10-29 22:12:27'),(8,'louisstow',2,1,5,413.631,'2012-10-29 22:53:10'),(9,'louisstow',3,2,1,55.000,'2012-10-29 23:35:52'),(10,'mikehenrty',2,1,10,25.298,'2012-10-29 23:38:42'),(11,'mikehenrty',3,2,5,10.000,'2012-10-29 23:39:11'),(12,'billyist',2,1,1,21.943,'2012-10-30 21:28:46'),(13,'timcameronryan',2,1,4,29.829,'2012-10-30 21:32:20'),(14,'matthackett',2,1,8,6.584,'2012-10-30 22:12:41'),(15,'shileizer',2,1,20,49.846,'2012-11-04 13:31:55'),(16,'j_redp',2,1,1000,2.560,'2012-11-10 11:53:51'),(17,'billyist',2,1,1000,21.943,'2012-11-10 12:00:38'),(18,'billyist',2,1,1000,21.943,'2012-11-10 12:01:03'),(19,'shileizer',3,1,5,49.846,'2012-11-10 12:38:10');
/*!40000 ALTER TABLE `history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio`
--

DROP TABLE IF EXISTS `portfolio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `portfolio` (
  `portfolioID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `stockID` varchar(100) NOT NULL,
  `userID` int(10) unsigned NOT NULL,
  `quantity` mediumint(8) unsigned NOT NULL,
  `cost` double(15,3) DEFAULT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`portfolioID`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio`
--

LOCK TABLES `portfolio` WRITE;
/*!40000 ALTER TABLE `portfolio` DISABLE KEYS */;
INSERT INTO `portfolio` VALUES (4,'j_redp',2,1,2.560,'2012-10-27 18:45:55'),(5,'obama',2,1,0.000,'2012-10-27 19:10:44'),(6,'j_redp',2,10,2.560,'2012-10-27 19:11:15'),(7,'j_redp',3,1,1.560,'2012-10-29 22:12:27'),(8,'louisstow',2,2,413.631,'2012-10-29 22:53:10'),(10,'mikehenrty',2,5,25.298,'2012-10-29 23:38:42'),(11,'mikehenrty',3,5,10.000,'2012-10-29 23:39:11'),(12,'billyist',2,1,21.943,'2012-10-30 21:28:46'),(13,'timcameronryan',2,4,29.829,'2012-10-30 21:32:20'),(14,'matthackett',2,8,6.584,'2012-10-30 22:12:41'),(15,'shileizer',2,15,49.846,'2012-11-04 13:31:55'),(16,'j_redp',2,1000,2.560,'2012-11-10 11:53:51'),(17,'billyist',2,1000,21.943,'2012-11-10 12:00:38'),(18,'billyist',2,1000,21.943,'2012-11-10 12:01:03'),(19,'shileizer',3,5,49.846,'2012-11-10 12:38:10');
/*!40000 ALTER TABLE `portfolio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `selling`
--

DROP TABLE IF EXISTS `selling`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `selling` (
  `tradeID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `stockID` varchar(100) NOT NULL,
  `sellerID` int(10) unsigned NOT NULL,
  `quantity` mediumint(8) unsigned NOT NULL,
  `cost` double(15,3) DEFAULT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`tradeID`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selling`
--

LOCK TABLES `selling` WRITE;
/*!40000 ALTER TABLE `selling` DISABLE KEYS */;
INSERT INTO `selling` VALUES (1,'louisstow',1,99992,413.631,'2012-10-24 00:19:45'),(2,'billyist',1,97999,21.943,'2012-10-24 00:35:53'),(3,'csl_',1,99986,34.395,'2012-10-24 01:56:08'),(4,'fat',1,100000,722930.991,'2012-10-25 01:53:19'),(5,'timcameronryan',1,99996,29.829,'2012-10-25 01:55:55'),(6,'jrpetker',1,100000,0.000,'2012-10-25 11:04:28'),(7,'j_redp',1,98986,2.560,'2012-10-25 13:59:15'),(8,'mikehenrty',1,99990,25.298,'2012-10-25 16:00:19'),(9,'mcav',1,100000,46.454,'2012-10-25 16:00:43'),(10,'matthackett',1,99992,6.584,'2012-10-25 16:18:29'),(11,'obama',1,99997,0.000,'2012-10-25 18:51:21'),(16,'craftyjs',1,100000,2402.185,'2012-10-29 01:19:11'),(25,'shileizer',1,99975,49.846,'2012-10-30 14:45:10'),(26,'the_jaguilar',1,100000,5.207,'2012-11-03 15:42:58'),(27,'shileizer',2,5,80.000,'2012-11-04 13:33:19'),(28,'louisstow',3,1,80.000,'2012-11-04 15:02:03'),(29,'Sosowski',1,100000,12643.936,'2012-11-10 11:57:51');
/*!40000 ALTER TABLE `selling` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stocks`
--

DROP TABLE IF EXISTS `stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stocks` (
  `stockID` varchar(100) NOT NULL,
  `tweets` int(10) unsigned NOT NULL,
  `followers` int(10) unsigned NOT NULL,
  `following` int(10) unsigned NOT NULL,
  `cost` double(15,3) DEFAULT NULL,
  `dayCost` double(15,3) DEFAULT NULL,
  `image` varchar(200) NOT NULL,
  PRIMARY KEY (`stockID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stocks`
--

LOCK TABLES `stocks` WRITE;
/*!40000 ALTER TABLE `stocks` DISABLE KEYS */;
INSERT INTO `stocks` VALUES ('billyist',1373,136,73,21.943,21.943,'http://a0.twimg.com/profile_images/1556398651/sine_normal.jpg'),('craftyjs',409,560,174,2402.185,2402.185,'http://a0.twimg.com/profile_images/1201484496/tail_normal.png'),('csl_',30800,573,173,34.395,34.395,'http://a0.twimg.com/profile_images/2440275496/lr0hlrnzga6b8jia0ih7_normal.jpeg'),('fat',6205,13550,508,722930.991,722930.991,'http://a0.twimg.com/profile_images/2621805828/313ualazgg2yonnlsnd7_normal.png'),('j_redp',6,16,28,2.560,1.560,'http://a0.twimg.com/profile_images/2763972717/245515852d7ce3a49d25e75971837987_normal.jpeg'),('louisstow',403,381,334,55.000,55.000,'http://a0.twimg.com/profile_images/2809146576/39a08a8a44e7e3cd364c1de1b1eb82fe_normal.jpeg'),('matthackett',21,25,113,6.584,6.584,'http://a0.twimg.com/profile_images/1981012419/Matt_York_normal.jpg'),('mcav',2099,181,64,46.454,46.454,'http://a0.twimg.com/profile_images/2647458882/d30985349f77c025af94c0107ff44c24_normal.png'),('mikehenrty',782,163,212,10.000,10.000,'http://a0.twimg.com/profile_images/2833230119/aa6a829debd0815740942ef0a46f792b_normal.jpeg'),('obama',0,5848,0,0.000,0.000,'http://a0.twimg.com/sticky/default_profile_images/default_profile_1_normal.png'),('shileizer',5,21,39,49.846,49.846,'http://a0.twimg.com/profile_images/2817902200/d003227aa7e9a7c1d9dbedc1366631df_normal.jpeg'),('Sosowski',6565,3259,417,12643.936,0.000,'http://a0.twimg.com/profile_images/2816583647/4a39a1c4cebd843b1e472d7342799309_normal.jpeg'),('the_jaguilar',21,14,35,5.207,5.207,'http://a0.twimg.com/profile_images/2606032296/29120_681926531603_201533_38020649_511152_n_normal.jpg'),('timcameronryan',5090,409,446,29.829,29.829,'http://a0.twimg.com/profile_images/2543631958/image_normal.jpg');
/*!40000 ALTER TABLE `stocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `userID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `money` double(15,2) NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'TweetStreet','louisstow@gmail.com','2SZtpGeBVE3UM+3JRGZBBAK+6Ys=',1.00,'2012-10-01 00:00:00'),(2,'louisstow','','2SZtpGeBVE3UM+3JRGZBBAK+6Ys=',951249.19,'2012-10-24 01:56:07'),(3,'test','','2SZtpGeBVE3UM+3JRGZBBAK+6Ys=',9750.77,'2012-10-29 21:38:35');
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

-- Dump completed on 2012-11-11 15:27:38
