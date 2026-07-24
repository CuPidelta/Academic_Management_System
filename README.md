**#POST MAN**
<img width="1020" height="608" alt="student P3" src="https://github.com/user-attachments/assets/a1cff938-eadb-402a-800c-487b9880f655" />
<img width="1033" height="648" alt="enrollment" src="https://github.com/user-attachments/assets/03e96ef5-698d-4510-bf30-09d0a55e9b2e" />
<img width="1024" height="546" alt="Enrolled" src="https://github.com/user-attachments/assets/b04c587b-835f-429b-9a6a-840b179a2e29" />
<img width="1018" height="649" alt="Enrolled 2" src="https://github.com/user-attachments/assets/4eb9c80b-6ba5-4fc7-a33f-5931aa9d6f03" />
<img width="1016" height="651" alt="courses" src="https://github.com/user-attachments/assets/27a11128-fe5c-4ba9-aaeb-6492e9a6fe68" />

{
"info": {
"\_postman_id": "fce71025-93d6-4425-8a10-864b80c25105",
"name": "My Collection",
"description": "### Welcome to Postman! This is your first collection. \n\nCollections are your starting point for building and testing APIs. You can use this one to:\n\n• Group related requests\n• Test your API in real-world scenarios\n• Document and share your requests\n\nUpdate the name and overview whenever you’re ready to make it yours.\n\n[Learn more about Postman Collections.](https://learning.postman.com/docs/collections/collections-overview/)",
"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
"\_exporter_id": "52414531",
"\_collection_link": "https://go.postman.co/collection/52414531-fce71025-93d6-4425-8a10-864b80c25105?source=collection_link"
},
"item": [
{
"name": "http://localhost:3000/auth/register",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "{\r\n \"full_name\": \"Jeth Roe\",\r\n \"email\": \"jeth@gmail.com\",\r\n \"password\": \"jeth\",\r\n \"role_name\": \"student\",\r\n \"custom_id\": \"143567\",\r\n \"year_level\": \"1st Year\",\r\n \"program\": \"BSIT\"\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/register",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"register"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/login",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "{\r\n \"email\": \"admin@gmail.com\",\r\n \"password\": \"admin\"\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/login",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"login"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/courses/create",
"request": {
"auth": {
"type": "bearer",
"bearer": [
{
"key": "token",
"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyNzkzMDAyLCJleHAiOjE3NzI4MjE4MDJ9.D4VCzHdJUnz-0mFClrix9NTBqG6zKITEiOhmzEMnics",
"type": "string"
}
]
},
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "{\r\n \"course_code\": \"CCE105\",\r\n \"title\": \"Data Structure and Algorithm\",\r\n \"description\": \"Fundamentals of Programming\",\r\n \"units\": 3\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/courses/create",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"courses",
"create"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/enrollment/enroll",
"request": {
"auth": {
"type": "bearer",
"bearer": [
{
"key": "token",
"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyNzkzMDAyLCJleHAiOjE3NzI4MjE4MDJ9.D4VCzHdJUnz-0mFClrix9NTBqG6zKITEiOhmzEMnics",
"type": "string"
}
]
},
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "{\r\n \"student_id\": 3,\r\n \"course_id\": 16\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/enrollment/enroll",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"enrollment",
"enroll"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/enrollment/all",
"request": {
"auth": {
"type": "bearer",
"bearer": [
{
"key": "token",
"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyNzkzMDAyLCJleHAiOjE3NzI4MjE4MDJ9.D4VCzHdJUnz-0mFClrix9NTBqG6zKITEiOhmzEMnics",
"type": "string"
}
]
},
"method": "GET",
"header": [],
"url": {
"raw": "http://localhost:3000/enrollment/all",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"enrollment",
"all"
]
}
},
"response": []
}
]
}

**#DATABASE**

[ams_db.sql](https://github.com/user-attachments/files/25792988/ams_db.sql)
-- MySQL dump 10.13 Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1 Database: ams_db

---

-- Server version 5.5.5-10.4.32-MariaDB

/_!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT _/;
/_!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS _/;
/_!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION _/;
/_!50503 SET NAMES utf8 _/;
/_!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE _/;
/_!40103 SET TIME_ZONE='+00:00' _/;
/_!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 _/;
/_!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 _/;
/_!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' _/;
/_!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 _/;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `courses` (
`course_id` int(11) NOT NULL AUTO*INCREMENT,
`course_code` varchar(20) NOT NULL,
`title` varchar(150) NOT NULL,
`units` int(11) NOT NULL DEFAULT 3,
`instructor_id` int(11) DEFAULT NULL,
`created_at` timestamp NOT NULL DEFAULT current_timestamp(),
`updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
`deleted_at` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`course_id`),
UNIQUE KEY `course_code` (`course_code`),
KEY `fk_course_instructor` (`instructor_id`),
KEY `idx_course_code` (`course_code`),
CONSTRAINT `fk_course_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character*set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/_!40000 ALTER TABLE `courses` DISABLE KEYS _/;
INSERT INTO `courses` VALUES (1,'IT101','Introduction to Computing',3,NULL,'2026-03-05 17:12:34','2026-03-05 17:12:34',NULL),(2,'IT102','Computer Programming 1',3,NULL,'2026-03-05 17:12:34','2026-03-05 17:12:34',NULL),(3,'IT201','Data Structures and Algorithms',3,NULL,'2026-03-05 17:12:34','2026-03-05 17:12:34',NULL),(4,'IT202','Web Systems and Technologies',3,NULL,'2026-03-05 17:12:34','2026-03-05 17:12:34',NULL),(5,'IT301','Information Assurance and Security',3,NULL,'2026-03-05 17:12:34','2026-03-05 17:12:34',NULL),(6,'IT302','Network Management',3,NULL,'2026-03-05 17:12:34','2026-03-05 17:12:34',NULL),(7,'CS101','Discrete Mathematics',3,NULL,'2026-03-05 17:12:50','2026-03-05 17:12:50',NULL),(8,'CS102','Object-Oriented Programming',3,NULL,'2026-03-05 17:12:50','2026-03-05 17:12:50',NULL),(9,'CS201','CS Theory and Automata',3,NULL,'2026-03-05 17:12:50','2026-03-05 17:12:50',NULL),(10,'CS202','Design and Analysis of Algorithms',3,NULL,'2026-03-05 17:12:50','2026-03-05 17:12:50',NULL),(11,'CS301','Operating Systems',3,NULL,'2026-03-05 17:12:50','2026-03-05 17:12:50',NULL),(12,'CS302','Software Engineering',3,NULL,'2026-03-05 17:12:50','2026-03-05 17:12:50',NULL),(13,'IT15/L','Integrative Programming Technologies',3,5,'2026-03-05 18:13:17','2026-03-05 18:13:17',NULL),(15,'IT16/L','Information Security',3,5,'2026-03-05 18:44:48','2026-03-05 18:44:48',NULL),(16,'CCE105','Data Structure and Algorithm',3,NULL,'2026-03-06 10:30:40','2026-03-06 10:30:40',NULL);
/_!40000 ALTER TABLE `courses` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `enrollments` (
`enrollment_id` int(11) NOT NULL AUTO*INCREMENT,
`student_id` int(11) NOT NULL,
`course_id` int(11) NOT NULL,
`status` enum('Enrolled','Dropped','Completed') DEFAULT 'Enrolled',
`enrolled_at` timestamp NOT NULL DEFAULT current_timestamp(),
`enrollment_date` timestamp NOT NULL DEFAULT current_timestamp(),
PRIMARY KEY (`enrollment_id`),
UNIQUE KEY `unique_student_course` (`student_id`,`course_id`),
KEY `fk_enroll_course` (`course_id`),
CONSTRAINT `fk_enroll_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE,
CONSTRAINT `fk_enroll_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character*set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/_!40000 ALTER TABLE `enrollments` DISABLE KEYS _/;
INSERT INTO `enrollments` VALUES (1,2,13,'Enrolled','2026-03-05 18:25:38','2026-03-05 18:42:06'),(3,2,15,'Enrolled','2026-03-05 18:45:23','2026-03-05 18:45:23'),(5,3,16,'Enrolled','2026-03-06 10:34:03','2026-03-06 10:34:03');
/_!40000 ALTER TABLE `enrollments` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `grades` (
`grade_id` int(11) NOT NULL AUTO*INCREMENT,
`enrollment_id` int(11) NOT NULL,
`grade_value` decimal(5,2) DEFAULT NULL,
`remarks` varchar(255) DEFAULT 'No remarks',
`updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
PRIMARY KEY (`grade_id`),
UNIQUE KEY `enrollment_id` (`enrollment_id`),
CONSTRAINT `fk_grade_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`enrollment_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character*set_client = @saved_cs_client */;

--
-- Dumping data for table `grades`
--

LOCK TABLES `grades` WRITE;
/_!40000 ALTER TABLE `grades` DISABLE KEYS _/;
/_!40000 ALTER TABLE `grades` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `roles` (
`role_id` int(11) NOT NULL AUTO*INCREMENT,
`role_name` varchar(50) NOT NULL,
PRIMARY KEY (`role_id`),
UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character*set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/_!40000 ALTER TABLE `roles` DISABLE KEYS _/;
INSERT INTO `roles` VALUES (1,'Admin'),(3,'Instructor'),(2,'Registrar'),(4,'Student');
/_!40000 ALTER TABLE `roles` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `students` (
`student_id` int(11) NOT NULL AUTO*INCREMENT,
`custom_id` varchar(50) NOT NULL,
`user_id` int(11) NOT NULL,
`full_name` varchar(255) NOT NULL,
`email` varchar(255) NOT NULL,
`year_level` enum('1st Year','2nd Year','3rd Year','4th Year') NOT NULL,
`program` varchar(100) NOT NULL,
`created_at` timestamp NOT NULL DEFAULT current_timestamp(),
`updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
`deleted_at` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`student_id`),
UNIQUE KEY `custom_id` (`custom_id`),
UNIQUE KEY `email` (`email`),
KEY `fk_user_student` (`user_id`),
CONSTRAINT `fk_user_student` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character*set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/_!40000 ALTER TABLE `students` DISABLE KEYS _/;
INSERT INTO `students` VALUES (1,'144656',2,'Yuta Okkotsu','yuta@gmail.com','2nd Year','BSIT','2026-03-02 13:28:08','2026-03-02 13:28:08',NULL),(2,'144543',3,'Maki Zenin','maki@gmail.com','3rd Year','BSCS','2026-03-04 15:24:24','2026-03-04 15:24:24',NULL),(3,'143567',7,'','','1st Year','BSIT','2026-03-06 10:20:04','2026-03-06 10:20:04',NULL);
/_!40000 ALTER TABLE `students` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `users` (
`user_id` int(11) NOT NULL AUTO*INCREMENT,
`full_name` varchar(100) NOT NULL,
`email` varchar(100) NOT NULL,
`password_hash` varchar(255) NOT NULL,
`role_id` int(11) NOT NULL,
`deleted_at` timestamp NULL DEFAULT NULL,
`created_at` timestamp NOT NULL DEFAULT current_timestamp(),
PRIMARY KEY (`user_id`),
UNIQUE KEY `email` (`email`),
KEY `fk_user_role` (`role_id`),
CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character*set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/_!40000 ALTER TABLE `users` DISABLE KEYS _/;
INSERT INTO `users` VALUES (1,'Admin Manager','admin@gmail.com','$2b$10$c82DaBxpIA3Y0t24WhPnw.qRWVsyJdWrDXJuhfEqvlNehk0egdHCu',1,NULL,'2026-03-02 13:20:15'),(2,'Yuta Okkotsu','yuta@gmail.com','$2b$10$xJdCrB5QHsP0iqR2MqIjKes2846KxX0DlVXL9YakNiuxMODCFIKbe',4,NULL,'2026-03-02 13:28:08'),(3,'Maki Zenin','maki@gmail.com','$2b$10$VJYn8e6lARtedLOlUirCuumUEQuCN4eC.dGxwj2Z06PV5anSSDWwS',4,NULL,'2026-03-04 15:24:24'),(4,'Kugisaki Nobara','nobara@gmail.com','$2b$10$nysjw7PTg7Z5iZuwj3k8rOSk6.zZABk8I6Yc5X95d4q6fFcY/3AWu',2,NULL,'2026-03-05 13:25:46'),(5,'Gojo Saturo','gojo@gmail.com','$2b$10$Udqy2lBtywIgrLf8acMWgO1yV9g5fgS.mkPZCmacyynbY1QRFGZd2',3,NULL,'2026-03-05 17:10:05'),(7,'Jeth Roe','jeth@gmail.com','$2b$10$ALM8gu/y664tvE9969wu0e989S58UtnEPm7j1d.q8p.9FXRmfhJje',4,NULL,'2026-03-06 10:20:04');
/_!40000 ALTER TABLE `users` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Dumping routines for database 'ams*db'
--
/*!40103 SET TIME*ZONE=@OLD_TIME_ZONE */;

/_!40101 SET SQL_MODE=@OLD_SQL_MODE _/;
/_!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS _/;
/_!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS _/;
/_!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT _/;
/_!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS _/;
/_!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION _/;
/_!40111 SET SQL_NOTES=@OLD_SQL_NOTES _/;

-- Dump completed on 2026-03-06 18:54:33

**#ERD**
<img width="3929" height="1605" alt="updated ERD" src="https://github.com/user-attachments/assets/a767f55e-5536-4df0-b6c1-692cc25516e9" />

**#FINAL**

**#POSTMAN**
{
"info": {
"\_postman_id": "488345dc-ca64-4f94-89c8-24b379d8d04c",
"name": "Final",
"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
"\_exporter_id": "52414531",
"\_collection_link": "https://go.postman.co/collection/52414531-488345dc-ca64-4f94-89c8-24b379d8d04c?source=collection_link"
},
"item": [
{
"name": "http://localhost:3000/auth/register",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "{\r\n \"full_name\": \"System Administrator\",\r\n \"email\": \"admin@gmail.com\",\r\n \"password\": \"admin\",\r\n \"role_name\": \"Admin\"\r\n}\r\n\r\n// {\r\n// \"full_name\": \"Mon Roe\",\r\n// \"email\": \"mon@gmail.com\",\r\n// \"password\": \"mon\",\r\n// \"role_name\": \"student\",\r\n// \"custom_id\": \"1\",\r\n// \"year_level\": \"2nd Year\",\r\n// \"program\": \"BSIT\"\r\n// }\r\n\r\n// {\r\n// \"full_name\": \"Gojo Saturo\",\r\n// \"email\": \"gojo@gmail.com\",\r\n// \"password\": \"gojo\",\r\n// \"role_name\": \"Instructor\"\r\n// }",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/register",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"register"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/login",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "{\r\n \"email\": \"admin@gmail.com\",\r\n \"password\": \"admin\"\r\n}\r\n\r\n// {\"email\": \"mon@gmail.com\",\r\n// \"password\": \"mon\"\r\n// }\r\n\r\n// {\r\n// \"email\": \"gojo@gmail.com\",\r\n// \"password\": \"gojo\"\r\n// }",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/login",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"login"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/profile",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"auth": {
"type": "bearer",
"bearer": [
{
"key": "token",
"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzczNjMzMjM0LCJleHAiOjE3NzM2NjIwMzR9.kURHNq8d6D8Gv4CyFQTx_aNa7KAel_cds8oftsTTG34",
"type": "string"
}
]
},
"method": "GET",
"header": [],
"body": {
"mode": "raw",
"raw": "",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/profile",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"profile"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/register",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "// {\r\n// \"full_name\": \"System Administrator\",\r\n// \"email\": \"admin@gmail.com\",\r\n// \"password\": \"admin\",\r\n// \"role_name\": \"Admin\"\r\n// }\r\n\r\n{\r\n \"full_name\": \"Mon Roe\",\r\n \"email\": \"mon@gmail.com\",\r\n \"password\": \"mon\",\r\n \"role_name\": \"student\",\r\n \"custom_id\": \"1\",\r\n \"year_level\": \"2nd Year\",\r\n \"program\": \"BSIT\"\r\n}\r\n\r\n// {\r\n// \"full_name\": \"Gojo Saturo\",\r\n// \"email\": \"gojo@gmail.com\",\r\n// \"password\": \"gojo\",\r\n// \"role_name\": \"Instructor\"\r\n// }",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/register",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"register"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/login",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "// {\r\n// \"email\": \"admin@gmail.com\",\r\n// \"password\": \"admin\"\r\n// }\r\n\r\n{\"email\": \"mon@gmail.com\",\r\n \"password\": \"mon\"\r\n}\r\n\r\n// {\r\n// \"email\": \"gojo@gmail.com\",\r\n// \"password\": \"gojo\"\r\n// }",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/login",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"login"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/profile",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"auth": {
"type": "bearer",
"bearer": [
{
"key": "token",
"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3NzM2MzM0MTEsImV4cCI6MTc3MzY2MjIxMX0.vrlOYAU7O-4ZqidTqq0l4MZ54f5d1JnqkzNR-7Yd788",
"type": "string"
}
]
},
"method": "GET",
"header": [],
"body": {
"mode": "raw",
"raw": "",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/profile",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"profile"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/register",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "// {\r\n// \"full_name\": \"System Administrator\",\r\n// \"email\": \"admin@gmail.com\",\r\n// \"password\": \"admin\",\r\n// \"role_name\": \"Admin\"\r\n// }\r\n\r\n// {\r\n// \"full_name\": \"Mon Roe\",\r\n// \"email\": \"mon@gmail.com\",\r\n// \"password\": \"mon\",\r\n// \"role_name\": \"student\",\r\n// \"custom_id\": \"1\",\r\n// \"year_level\": \"2nd Year\",\r\n// \"program\": \"BSIT\"\r\n// }\r\n\r\n{\r\n \"full_name\": \"Gojo Saturo\",\r\n \"email\": \"gojo@gmail.com\",\r\n \"password\": \"gojo\",\r\n \"role_name\": \"Instructor\"\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/register",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"register"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/login",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "// {\r\n// \"email\": \"admin@gmail.com\",\r\n// \"password\": \"admin\"\r\n// }\r\n\r\n// {\"email\": \"mon@gmail.com\",\r\n// \"password\": \"mon\"\r\n// }\r\n\r\n{\r\n \"email\": \"gojo@gmail.com\",\r\n \"password\": \"gojo\"\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/login",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"login"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/profile",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"auth": {
"type": "bearer",
"bearer": [
{
"key": "token",
"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6Imluc3RydWN0b3IiLCJpYXQiOjE3NzM2MzM2MDQsImV4cCI6MTc3MzY2MjQwNH0.aFVGHWuDtwqdiH7C0qeQHVQMHgWkUYu3mnWxByrWHyM",
"type": "string"
}
]
},
"method": "GET",
"header": [],
"body": {
"mode": "raw",
"raw": "",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/profile",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"profile"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/register",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "// {\r\n// \"full_name\": \"System Administrator\",\r\n// \"email\": \"admin@gmail.com\",\r\n// \"password\": \"admin\",\r\n// \"role_name\": \"Admin\"\r\n// }\r\n\r\n// {\r\n// \"full_name\": \"Mon Roe\",\r\n// \"email\": \"mon@gmail.com\",\r\n// \"password\": \"mon\",\r\n// \"role_name\": \"student\",\r\n// \"custom_id\": \"1\",\r\n// \"year_level\": \"2nd Year\",\r\n// \"program\": \"BSIT\"\r\n// }\r\n\r\n// {\r\n// \"full_name\": \"Gojo Saturo\",\r\n// \"email\": \"gojo@gmail.com\",\r\n// \"password\": \"gojo\",\r\n// \"role_name\": \"Instructor\"\r\n// }\r\n\r\n{\r\n \"full_name\": \"Kugisaki Nobara\",\r\n \"email\": \"nobara@gmail.com\",\r\n \"password\": \"nobara\",\r\n \"role_name\": \"Registrar\"\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/register",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"register"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/login",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "// {\r\n// \"email\": \"admin@gmail.com\",\r\n// \"password\": \"admin\"\r\n// }\r\n\r\n// {\"email\": \"mon@gmail.com\",\r\n// \"password\": \"mon\"\r\n// }\r\n\r\n// {\r\n// \"email\": \"gojo@gmail.com\",\r\n// \"password\": \"gojo\"\r\n// }\r\n\r\n{\r\n \"email\": \"nobara@gmail.com\",\r\n \"password\": \"nobara\"\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/login",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"login"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/profile",
"protocolProfileBehavior": {
"disableBodyPruning": true
},
"request": {
"auth": {
"type": "bearer",
"bearer": [
{
"key": "token",
"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZSI6InJlZ2lzdHJhciIsImlhdCI6MTc3MzYzMzc4OCwiZXhwIjoxNzczNjYyNTg4fQ.m0nH2oiirxkZyhidyXVHvJ2bVHq1Bw6XkWbDSXyEr80",
"type": "string"
}
]
},
"method": "GET",
"header": [],
"body": {
"mode": "raw",
"raw": "",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/profile",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"profile"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/login",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "// {\r\n// \"email\": \"admin@gmail.com\",\r\n// \"password\": \"admin\"\r\n// }\r\n\r\n// {\"email\": \"mon@gmail.com\",\r\n// \"password\": \"mon\"\r\n// }\r\n\r\n// {\r\n// \"email\": \"gojo@gmail.com\",\r\n// \"password\": \"gojo\"\r\n// }\r\n\r\n{\r\n \"email\": \"nobara@gmail.com\",\r\n \"password\": \"nobara\"\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/login",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"login"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/courses/create",
"request": {
"auth": {
"type": "bearer",
"bearer": [
{
"key": "token",
"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZSI6InJlZ2lzdHJhciIsImlhdCI6MTc3MzYzNDE3NiwiZXhwIjoxNzczNjYyOTc2fQ.NjSlCCORVH_2SBhu-B-EUxJpTN0_sOiOi-6LRjg2IG0",
"type": "string"
}
]
},
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "{\r\n \"course_code\": \"UGE2\",\r\n \"title\": \"Technical Writing\",\r\n \"units\": 3,\r\n \"instructor_id\": 1\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/courses/create",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"courses",
"create"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/login",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "// {\r\n// \"email\": \"admin@gmail.com\",\r\n// \"password\": \"admin\"\r\n// }\r\n\r\n// {\"email\": \"mon@gmail.com\",\r\n// \"password\": \"mon\"\r\n// }\r\n\r\n// {\r\n// \"email\": \"gojo@gmail.com\",\r\n// \"password\": \"gojo\"\r\n// }\r\n\r\n{\r\n \"email\": \"nobara@gmail.com\",\r\n \"password\": \"nobara\"\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/login",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"login"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/enrollment/enroll",
"request": {
"auth": {
"type": "bearer",
"bearer": [
{
"key": "token",
"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZSI6InJlZ2lzdHJhciIsImlhdCI6MTc3MzYzNTUzNiwiZXhwIjoxNzczNjY0MzM2fQ.qvWLhRMmvC6SmOQipC7KXjB8eSpTuxLtcASsXyMpDDg",
"type": "string"
}
]
},
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "{\r\n \"student_id\": 1,\r\n \"course_id\": 1,\r\n \"term\": \"1st Term\",\r\n \"semester\": \"1st Semester\"\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/enrollment/enroll",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"enrollment",
"enroll"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/courses/13",
"request": {
"auth": {
"type": "bearer",
"bearer": [
{
"key": "token",
"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZSI6InJlZ2lzdHJhciIsImlhdCI6MTc3MzYzNTE0OCwiZXhwIjoxNzczNjYzOTQ4fQ.1H_xWsiwdFr936pXyK7pOcTTT9Arl-c00RQXNtpDli8",
"type": "string"
}
]
},
"method": "PUT",
"header": [],
"body": {
"mode": "raw",
"raw": "{\r\n \"title\": \"Technical Writing\",\r\n \"course_code\": \"UGE2\",\r\n \"units\": 3,\r\n \"instructor_id\": 3\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/courses/13",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"courses",
"13"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/login",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "{\r\n \"email\": \"admin@gmail.com\",\r\n \"password\": \"admin\"\r\n}\r\n\r\n// {\"email\": \"mon@gmail.com\",\r\n// \"password\": \"mon\"\r\n// }\r\n\r\n// {\r\n// \"email\": \"gojo@gmail.com\",\r\n// \"password\": \"gojo\"\r\n// }\r\n\r\n// {\r\n// \"email\": \"nobara@gmail.com\",\r\n// \"password\": \"nobara\"\r\n// }",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/login",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"login"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/enrollment/all",
"request": {
"auth": {
"type": "bearer",
"bearer": [
{
"key": "token",
"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzczNjM2MTEyLCJleHAiOjE3NzM2NjQ5MTJ9.fBnFEGxGMhswpZOAko6jtm4r3f3sDDhzXSGqmFHTYxk",
"type": "string"
}
]
},
"method": "GET",
"header": [],
"url": {
"raw": "http://localhost:3000/enrollment/all",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"enrollment",
"all"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/login",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "{\r\n \"email\": \"admin@gmail.com\",\r\n \"password\": \"admin\"\r\n}\r\n\r\n// {\"email\": \"mon@gmail.com\",\r\n// \"password\": \"mon\"\r\n// }\r\n\r\n// {\r\n// \"email\": \"gojo@gmail.com\",\r\n// \"password\": \"gojo\"\r\n// }\r\n\r\n// {\r\n// \"email\": \"nobara@gmail.com\",\r\n// \"password\": \"nobara\"\r\n// }",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/login",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"login"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/enrollment/all",
"request": {
"auth": {
"type": "bearer",
"bearer": [
{
"key": "token",
"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzczNjM2MTEyLCJleHAiOjE3NzM2NjQ5MTJ9.fBnFEGxGMhswpZOAko6jtm4r3f3sDDhzXSGqmFHTYxk",
"type": "string"
}
]
},
"method": "GET",
"header": [],
"url": {
"raw": "http://localhost:3000/enrollment/all",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"enrollment",
"all"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/login",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "// {\r\n// \"email\": \"admin@gmail.com\",\r\n// \"password\": \"admin\"\r\n// }\r\n\r\n{\"email\": \"mon@gmail.com\",\r\n \"password\": \"mon\"\r\n}\r\n\r\n// {\r\n// \"email\": \"gojo@gmail.com\",\r\n// \"password\": \"gojo\"\r\n// }\r\n\r\n// {\r\n// \"email\": \"nobara@gmail.com\",\r\n// \"password\": \"nobara\"\r\n// }",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/login",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"login"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/enrollment/my",
"request": {
"auth": {
"type": "bearer",
"bearer": [
{
"key": "token",
"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3NzM2MzY2MTgsImV4cCI6MTc3MzY2NTQxOH0.rXiXskHdFXpMS4LZxx55BPm1i6Cusq20JdK-amhnRrU",
"type": "string"
}
]
},
"method": "GET",
"header": [],
"url": {
"raw": "http://localhost:3000/enrollment/my",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"enrollment",
"my"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/login",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "// {\r\n// \"email\": \"admin@gmail.com\",\r\n// \"password\": \"admin\"\r\n// }\r\n\r\n// {\"email\": \"mon@gmail.com\",\r\n// \"password\": \"mon\"\r\n// }\r\n\r\n{\r\n \"email\": \"gojo@gmail.com\",\r\n \"password\": \"gojo\"\r\n}\r\n\r\n// {\r\n// \"email\": \"nobara@gmail.com\",\r\n// \"password\": \"nobara\"\r\n// }",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/login",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"login"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/instructor/submit-grade",
"request": {
"auth": {
"type": "bearer",
"bearer": [
{
"key": "token",
"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6Imluc3RydWN0b3IiLCJpYXQiOjE3NzM2Mzc1OTEsImV4cCI6MTc3MzY2NjM5MX0.BtzJaTtJkrbUxY5iHyNL7UhF3oc_WI9AgZxEVhwIXio",
"type": "string"
}
]
},
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "{\r\n \"enrollment_id\": 3,\r\n \"grade_value\": 1.25,\r\n \"remarks\": \"Passed\"\r\n}",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/instructor/submit-grade",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"instructor",
"submit-grade"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/auth/login",
"request": {
"method": "POST",
"header": [],
"body": {
"mode": "raw",
"raw": "// {\r\n// \"email\": \"admin@gmail.com\",\r\n// \"password\": \"admin\"\r\n// }\r\n\r\n{\"email\": \"mon@gmail.com\",\r\n \"password\": \"mon\"\r\n}\r\n\r\n// {\r\n// \"email\": \"gojo@gmail.com\",\r\n// \"password\": \"gojo\"\r\n// }\r\n\r\n// {\r\n// \"email\": \"nobara@gmail.com\",\r\n// \"password\": \"nobara\"\r\n// }",
"options": {
"raw": {
"language": "json"
}
}
},
"url": {
"raw": "http://localhost:3000/auth/login",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"auth",
"login"
]
}
},
"response": []
},
{
"name": "http://localhost:3000/grades/my",
"request": {
"auth": {
"type": "bearer",
"bearer": [
{
"key": "token",
"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3NzM2Mzc2NjEsImV4cCI6MTc3MzY2NjQ2MX0.x1W09drFvcYBVkmW6_d7t7KFXK2XwAOaATcVZUXxDmk",
"type": "string"
}
]
},
"method": "GET",
"header": [],
"url": {
"raw": "http://localhost:3000/grades/my",
"protocol": "http",
"host": [
"localhost"
],
"port": "3000",
"path": [
"grades",
"my"
]
}
},
"response": []
}
]
}

**#DATABASE**

## -- MySQL dump 10.13 Distrib 8.0.45, for Win64 (x86_64)

-- Host: 127.0.0.1 Database: ams_db

---

-- Server version 5.5.5-10.4.32-MariaDB

/_!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT _/;
/_!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS _/;
/_!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION _/;
/_!50503 SET NAMES utf8 _/;
/_!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE _/;
/_!40103 SET TIME_ZONE='+00:00' _/;
/_!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 _/;
/_!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 _/;
/_!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' _/;
/_!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 _/;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `courses` (
`course_id` int(11) NOT NULL AUTO*INCREMENT,
`course_code` varchar(20) NOT NULL,
`title` varchar(150) NOT NULL,
`units` int(11) NOT NULL DEFAULT 3,
`instructor_id` int(11) DEFAULT NULL,
`created_at` timestamp NOT NULL DEFAULT current_timestamp(),
`updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
`deleted_at` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`course_id`),
UNIQUE KEY `course_code` (`course_code`),
KEY `fk_course_instructor` (`instructor_id`),
KEY `idx_course_code` (`course_code`),
CONSTRAINT `fk_course_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character*set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/_!40000 ALTER TABLE `courses` DISABLE KEYS _/;
INSERT INTO `courses` VALUES (1,'IT101','Introduction to Computing',3,3,'2026-03-16 03:50:48','2026-03-16 05:05:50',NULL),(2,'IT102','Computer Programming 1',3,NULL,'2026-03-16 03:50:48','2026-03-16 03:50:48',NULL),(3,'IT201','Data Structures and Algorithms',3,NULL,'2026-03-16 03:50:48','2026-03-16 03:50:48',NULL),(4,'IT202','Web Systems and Technologies',3,NULL,'2026-03-16 03:50:48','2026-03-16 03:50:48',NULL),(5,'IT301','Information Assurance and Security',3,NULL,'2026-03-16 03:50:48','2026-03-16 03:50:48',NULL),(6,'IT302','Network Management',3,NULL,'2026-03-16 03:50:48','2026-03-16 03:50:48',NULL),(7,'CS101','Discrete Mathematics',3,NULL,'2026-03-16 03:50:48','2026-03-16 03:50:48',NULL),(8,'CS102','Object-Oriented Programming',3,NULL,'2026-03-16 03:50:48','2026-03-16 03:50:48',NULL),(9,'CS201','CS Theory and Automata',3,NULL,'2026-03-16 03:50:48','2026-03-16 03:50:48',NULL),(10,'CS202','Design and Analysis of Algorithms',3,NULL,'2026-03-16 03:50:48','2026-03-16 03:50:48',NULL),(11,'CS301','Operating Systems',3,NULL,'2026-03-16 03:50:48','2026-03-16 03:50:48',NULL),(12,'CS302','Software Engineering',3,NULL,'2026-03-16 03:50:48','2026-03-16 03:50:48',NULL),(13,'UGE2','Technical Writing',3,3,'2026-03-16 04:09:56','2026-03-16 04:23:14',NULL);
/_!40000 ALTER TABLE `courses` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `enrollments` (
`enrollment_id` int(11) NOT NULL AUTO*INCREMENT,
`student_id` int(11) NOT NULL,
`course_id` int(11) NOT NULL,
`status` enum('Enrolled','Dropped','Completed') DEFAULT 'Enrolled',
`term` varchar(20) DEFAULT NULL,
`semester` varchar(20) DEFAULT NULL,
`enrolled_at` timestamp NOT NULL DEFAULT current_timestamp(),
`dropped_at` datetime DEFAULT NULL,
PRIMARY KEY (`enrollment_id`),
UNIQUE KEY `unique_enrollment` (`student_id`,`course_id`,`term`,`semester`),
KEY `fk_enrollment_course` (`course_id`),
CONSTRAINT `fk_enrollment_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE,
CONSTRAINT `fk_enrollment_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character*set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/_!40000 ALTER TABLE `enrollments` DISABLE KEYS _/;
INSERT INTO `enrollments` VALUES (2,1,1,'Enrolled','1st Term','1st Semester','2026-03-16 04:33:13',NULL),(3,1,13,'Enrolled','1st Term','1st Semester','2026-03-16 04:43:24',NULL);
/_!40000 ALTER TABLE `enrollments` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `grades` (
`grade_id` int(11) NOT NULL AUTO*INCREMENT,
`enrollment_id` int(11) NOT NULL,
`grade_value` decimal(5,2) DEFAULT NULL,
`remarks` varchar(255) DEFAULT 'No remarks',
`updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
PRIMARY KEY (`grade_id`),
UNIQUE KEY `enrollment_id` (`enrollment_id`),
CONSTRAINT `fk_grade_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`enrollment_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character*set_client = @saved_cs_client */;

--
-- Dumping data for table `grades`
--

LOCK TABLES `grades` WRITE;
/_!40000 ALTER TABLE `grades` DISABLE KEYS _/;
INSERT INTO `grades` VALUES (1,2,1.25,'Passed','2026-03-16 05:02:05'),(2,3,1.25,'Passed','2026-03-16 05:06:46');
/_!40000 ALTER TABLE `grades` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `roles` (
`role_id` int(11) NOT NULL AUTO*INCREMENT,
`role_name` varchar(50) NOT NULL,
PRIMARY KEY (`role_id`),
UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character*set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/_!40000 ALTER TABLE `roles` DISABLE KEYS _/;
INSERT INTO `roles` VALUES (1,'Admin'),(3,'Instructor'),(2,'Registrar'),(4,'Student');
/_!40000 ALTER TABLE `roles` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `students` (
`student_id` int(11) NOT NULL AUTO*INCREMENT,
`user_id` int(11) NOT NULL,
`custom_id` varchar(50) NOT NULL,
`full_name` varchar(255) NOT NULL,
`email` varchar(255) NOT NULL,
`year_level` enum('1st Year','2nd Year','3rd Year','4th Year') NOT NULL,
`program` varchar(100) NOT NULL,
`created_at` timestamp NOT NULL DEFAULT current_timestamp(),
`updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
`deleted_at` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`student_id`),
UNIQUE KEY `custom_id` (`custom_id`),
UNIQUE KEY `email` (`email`),
KEY `fk_student_user` (`user_id`),
CONSTRAINT `fk_student_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character*set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/_!40000 ALTER TABLE `students` DISABLE KEYS _/;
INSERT INTO `students` VALUES (1,2,'1','Mon Roe','mon@gmail.com','2nd Year','BSIT','2026-03-16 03:55:43','2026-03-16 03:55:43',NULL);
/_!40000 ALTER TABLE `students` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/_!40101 SET @saved_cs_client = @@character_set_client _/;
/_!50503 SET character_set_client = utf8mb4 _/;
CREATE TABLE `users` (
`user_id` int(11) NOT NULL AUTO*INCREMENT,
`full_name` varchar(100) NOT NULL,
`email` varchar(100) NOT NULL,
`password_hash` varchar(255) NOT NULL,
`role_id` int(11) NOT NULL,
`created_at` timestamp NOT NULL DEFAULT current_timestamp(),
`deleted_at` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`user_id`),
UNIQUE KEY `email` (`email`),
KEY `fk_user_role` (`role_id`),
CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character*set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/_!40000 ALTER TABLE `users` DISABLE KEYS _/;
INSERT INTO `users` VALUES (1,'System Administrator','admin@gmail.com','$2b$10$IAPZR8UD3PgVATdWfeSwrO7l9mG831ST4hb9i6.JIwTEv7oMByiuy',1,'2026-03-16 03:53:42',NULL),(2,'Mon Roe','mon@gmail.com','$2b$10$B98jK4GcQqwTKbVduxKze.foVC6X.ttz2l6OpZhOSU8yGBKu8eFYS',4,'2026-03-16 03:55:43',NULL),(3,'Gojo Saturo','gojo@gmail.com','$2b$10$E0jZHYaj4tf0l3.LG/t3O.4AUFzlfd8XWJmgLWbyffVic9oEDj7Cy',3,'2026-03-16 03:59:50',NULL),(4,'Kugisaki Nobara','nobara@gmail.com','$2b$10$1qh6WSbwBmzh4jIsRHC10.cUPVc.oe/BFv.R.2VcUEZGimymM58Vi',2,'2026-03-16 04:02:28',NULL);
/_!40000 ALTER TABLE `users` ENABLE KEYS _/;
UNLOCK TABLES;

--
-- Dumping routines for database 'ams*db'
--
/*!40103 SET TIME*ZONE=@OLD_TIME_ZONE */;

/_!40101 SET SQL_MODE=@OLD_SQL_MODE _/;
/_!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS _/;
/_!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS _/;
/_!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT _/;
/_!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS _/;
/_!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION _/;
/_!40111 SET SQL_NOTES=@OLD_SQL_NOTES _/;

-- Dump completed on 2026-03-16 13:35:10

**#PIC**

<img width="1366" height="730" alt="Image" src="https://github.com/user-attachments/assets/276028ed-483f-4165-b2ea-a161405f7a9e" />
<img width="1366" height="729" alt="Image" src="https://github.com/user-attachments/assets/1dff3a34-eae9-412b-b259-f7d9031841f6" />
<img width="1366" height="728" alt="Image" src="https://github.com/user-attachments/assets/3a50b419-e1d4-4135-a55f-3215753c1082" />
<img width="1366" height="730" alt="Image" src="https://github.com/user-attachments/assets/35841215-032d-4bea-a175-fff703b1d236" />
<img width="1366" height="727" alt="Image" src="https://github.com/user-attachments/assets/954cfabc-6a10-4888-b2f3-f5a89aaa588d" />
<img width="1366" height="730" alt="Image" src="https://github.com/user-attachments/assets/50732447-4a17-43a7-9152-5f984ccd10bd" />
<img width="1366" height="728" alt="Image" src="https://github.com/user-attachments/assets/7d958147-2b3a-4613-b513-36d9fb0c7d86" />
<img width="1366" height="728" alt="Image" src="https://github.com/user-attachments/assets/efab4ecb-3cc1-46c0-8db5-97403dbe34cf" />
<img width="1366" height="729" alt="Image" src="https://github.com/user-attachments/assets/b117bf7b-1eae-4fd6-a1ff-69e9635f632a" />
<img width="1366" height="732" alt="Image" src="https://github.com/user-attachments/assets/8375e4e2-29b3-412a-a4a5-b2a2f0982b1c" />
<img width="1366" height="731" alt="Image" src="https://github.com/user-attachments/assets/c5176a7c-f8b1-433d-a9ea-2703ecd9e3d4" />
<img width="1366" height="730" alt="Image" src="https://github.com/user-attachments/assets/26be0356-2049-4150-985e-d5ad2eeec716" />
<img width="1366" height="735" alt="Image" src="https://github.com/user-attachments/assets/77719e55-b21a-4a87-9ded-1d4e54048edb" />
<img width="1365" height="728" alt="Image" src="https://github.com/user-attachments/assets/905c8d0f-9198-4daa-8fd3-511e40e54625" />
<img width="1365" height="727" alt="Image" src="https://github.com/user-attachments/assets/58238da9-456a-41a7-a648-466a3de6ccef" />
<img width="1366" height="728" alt="Image" src="https://github.com/user-attachments/assets/144c6667-29b8-412b-9922-fccb941f57db" />
<img width="1366" height="727" alt="Image" src="https://github.com/user-attachments/assets/4f51cedb-1161-4ddf-b3ce-e9a2c707b07b" />
<img width="1365" height="726" alt="Image" src="https://github.com/user-attachments/assets/354f311a-8959-431e-af1a-5f6b9c25b28b" />
