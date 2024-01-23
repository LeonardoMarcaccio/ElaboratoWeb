-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 22, 2024 at 04:54 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `playpal`
--

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `Username` char(1) NOT NULL,
  `Date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `commuity`
--

CREATE TABLE `commuity` (
  `Name` char(1) NOT NULL,
  `Image` varchar(100) NOT NULL,
  `Description` varchar(500) NOT NULL,
  `Username` char(1) NOT NULL,
  `Fou_Username` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `frindship`
--

CREATE TABLE `frindship` (
  `Fri_Username` char(1) NOT NULL,
  `Username` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `join`
--

CREATE TABLE `join` (
  `Username` char(1) NOT NULL,
  `Name` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `Fri_Username` char(1) NOT NULL,
  `Username` char(1) NOT NULL,
  `Sender` char(1) NOT NULL,
  `Timestamp` date NOT NULL,
  `Text` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `Title` varchar(50) NOT NULL,
  `Image` varchar(100) DEFAULT NULL,
  `Tags` varchar(15) DEFAULT NULL,
  `Name` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thread`
--

CREATE TABLE `thread` (
  `Username` char(1) NOT NULL,
  `Date` date NOT NULL,
  `Content` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `Username` char(1) NOT NULL,
  `Email` varchar(30) NOT NULL,
  `Password` varchar(30) NOT NULL,
  `FirstName` varchar(30) DEFAULT NULL,
  `LastName` varchar(30) DEFAULT NULL,
  `Gender` varchar(20) DEFAULT NULL,
  `Biography` varchar(20) DEFAULT NULL,
  `PersonalWebsite` varchar(100) DEFAULT NULL,
  `Pfp` varchar(100) DEFAULT NULL,
  `Phonenumbers` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD KEY `FKAnswer` (`Username`,`Date`);

--
-- Indexes for table `commuity`
--
ALTER TABLE `commuity`
  ADD PRIMARY KEY (`Name`),
  ADD KEY `FKAdmin` (`Username`),
  ADD KEY `FKFound` (`Fou_Username`);

--
-- Indexes for table `frindship`
--
ALTER TABLE `frindship`
  ADD PRIMARY KEY (`Fri_Username`,`Username`),
  ADD KEY `FKFriend2` (`Username`);

--
-- Indexes for table `join`
--
ALTER TABLE `join`
  ADD PRIMARY KEY (`Name`,`Username`),
  ADD KEY `FKJoi_Use` (`Username`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`Fri_Username`,`Username`,`Sender`,`Timestamp`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD KEY `FKIn` (`Name`);

--
-- Indexes for table `thread`
--
ALTER TABLE `thread`
  ADD PRIMARY KEY (`Username`,`Date`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`Username`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `FKAnswer` FOREIGN KEY (`Username`,`Date`) REFERENCES `thread` (`Username`, `Date`);

--
-- Constraints for table `commuity`
--
ALTER TABLE `commuity`
  ADD CONSTRAINT `FKAdmin` FOREIGN KEY (`Username`) REFERENCES `user` (`Username`),
  ADD CONSTRAINT `FKFound` FOREIGN KEY (`Fou_Username`) REFERENCES `user` (`Username`);

--
-- Constraints for table `frindship`
--
ALTER TABLE `frindship`
  ADD CONSTRAINT `FKFriend1` FOREIGN KEY (`Fri_Username`) REFERENCES `user` (`Username`),
  ADD CONSTRAINT `FKFriend2` FOREIGN KEY (`Username`) REFERENCES `user` (`Username`);

--
-- Constraints for table `join`
--
ALTER TABLE `join`
  ADD CONSTRAINT `FKJoi_Com` FOREIGN KEY (`Name`) REFERENCES `commuity` (`Name`),
  ADD CONSTRAINT `FKJoi_Use` FOREIGN KEY (`Username`) REFERENCES `user` (`Username`);

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `FKChat` FOREIGN KEY (`Fri_Username`,`Username`) REFERENCES `frindship` (`Fri_Username`, `Username`);

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `FKIn` FOREIGN KEY (`Name`) REFERENCES `commuity` (`Name`);

--
-- Constraints for table `thread`
--
ALTER TABLE `thread`
  ADD CONSTRAINT `FKCrea` FOREIGN KEY (`Username`) REFERENCES `user` (`Username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
