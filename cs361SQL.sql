DROP DATABASE IF EXISTS `cs361`;
CREATE DATABASE `cs361`;
use `cs361`;

DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `user_password`;
DROP TABLE IF EXISTS `user_role`;
DROP TABLE IF EXISTS `word`;
DROP TABLE IF EXISTS `problem`;
DROP TABLE IF EXISTS `user_progress`;
DROP TABLE IF EXISTS `group`;
DROP TABLE IF EXISTS `group_students`;
DROP TABLE IF EXISTS `group_problems`;

CREATE TABLE `user_role` (
  `user_role_id` tinyint(1) NOT NULL AUTO_INCREMENT,
  `user_role_desc` varchar(255) NOT NULL,
  PRIMARY KEY (`user_role_id`)  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `DOB` date NOT NULL,
  `joinDate` date NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` int(16) DEFAULT NULL,
  `user_role_id` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_role_id`) REFERENCES `user_role` (`user_role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user_password` (
  `user_id` int(11) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `word` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `word` VARCHAR(255) NOT NULL,
  `isDolch` tinyint(1) NOT NULL,
  `difficulty_level` INT(11) NOT NULL,
  PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
 CREATE TABLE `problem` (
   `id` int(11) NOT NULL AUTO_INCREMENT,
   `answer` VARCHAR(255) NOT NULL,
   `incorrect_1` VARCHAR(255) NOT NULL,
   `incorrect_2` VARCHAR(255) NOT NULL,
   `incorrect_3` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user_progress` (
  `user_id` int(11) NOT NULL,
  `problem_id` int(11) NOT NULL,
  `passed` tinyint(1) NOT NULL,
  `attempt_date` date NOT NULL,
   PRIMARY KEY (`user_id`, `problem_id`),
   FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
   FOREIGN KEY (`problem_id`) REFERENCES `problem` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` VARCHAR(255) NOT NULL,
  `teacher` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`teacher`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `group_students` (
   `group_id` int(11) NOT NULL,
   `student_id` int(11) NOT NULL,
  PRIMARY KEY (`group_id`, `student_id`),
  FOREIGN KEY (`group_id`) REFERENCES `group` (`id`),
  FOREIGN KEY (`student_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `group_problems` (
   `group_id` int(11) NOT NULL,
   `problem_id` int(11) NOT NULL,
   PRIMARY KEY (`group_id`, `problem_id`),
   FOREIGN KEY (`group_id`) REFERENCES `group` (`id`),
   FOREIGN KEY (`problem_id`) REFERENCES `problem` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



INSERT INTO problem (`answer`, `incorrect_1`, `incorrect_2`, `incorrect_3`)
VALUES ('and', 'hello', 'Oregon', 'state'), ('computer', 'science', 'file', 'key'), ('phone', 'default', 'email', 'cell'), ('teacher', 'student', 'can', 'go');

INSERT INTO `user_role` (`user_role_desc`) VALUES
('student'), ('teacher');

INSERT INTO `user` (`first_name`, `last_name`, `DOB`, `joinDate`,
`email`, `phone`, `user_role_id`) VALUES
('Tanner', 'England', '1900-01-01', '2016-11-17', 'tanner@email.com',
'7145555555', '1'),
('Teacher', 'Squirrel', '1900-01-01', '2016-11-17', 'teacher@email.com',
'7145555555', '2');
