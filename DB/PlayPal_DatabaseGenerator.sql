-- *********************************************
-- * SQL MySQL generation                      
-- *--------------------------------------------
-- * DB-MAIN version: 11.0.2              
-- * Generator date: Sep 14 2021              
-- * Generation date: Sat Feb  3 19:56:52 2024 
-- * LUN file: C:\xampp\htdocs\Elab\DB\PlayPal.lun 
-- * Schema: PlayPal/1-4-1 
-- ********************************************* 


-- Database Section
-- ________________ 

CREATE DATABASE IF NOT EXISTS PlayPal;
use PlayPal;


-- Tables Section
-- _____________ 

create table Answer (
     CommentID int not null,
     PostID int not null,
     constraint FKAns_Com_ID primary key (CommentID));

create table Comment (
     CommentID int not null AUTO_INCREMENT,
     Date date not null,
     Content varchar(500) not null,
     Username varchar(50) not null,
     constraint IDComment_ID primary key (CommentID));

create table Community (
     Name varchar(50) not null,
     Image varchar(2083) not null,
     Description varchar(500) not null,
     Username varchar(50) not null,
     constraint IDCommuity primary key (Name));

create table Friendship (
     Fri_Username varchar(50) not null,
     Username varchar(50) not null,
     constraint IDFriendship primary key (Username, Fri_Username));

create table `Join` (
     Name varchar(50) not null,
     Username varchar(50) not null,
     constraint IDJoin primary key (Name, Username));

create table Message (
     Username varchar(50) not null,
     Fri_Username varchar(50) not null,
     Timestamp varchar(50) not null,
     Text varchar(500) not null,
     constraint IDMessage primary key (Username, Fri_Username, Timestamp));

create table Post (
     PostID int not null AUTO_INCREMENT,
     Date date not null,
     Content varchar(500) not null,
     Likes int default 0 not null,
     Title varchar(50) not null,
     Image varchar(2083),
     Name varchar(50) not null,
     Username varchar(50) not null,
     constraint IDPost_ID primary key (PostID));

create table Sessione (
     Token varchar(50) not null,
     Date varchar(50) not null,
     Username varchar(50) not null,
     constraint IDSessione primary key (Token));

create table User (
     Username varchar(50) not null,
     Email varchar(30) not null,
     Password varchar(60) not null,
     FirstName varchar(30),
     LastName varchar(30),
     Gender varchar(20),
     Biography varchar(500),
     PersonalWebsite varchar(100),
     Pfp varchar(2083),
     Phonenumbers varchar(15),
     Tries int default 0 not null,
     constraint IDUser primary key (Username));

create table SubComment (
     Sub_CommentID int not null,
     CommentID int not null,
     constraint FKSub_ID primary key (Sub_CommentID));

create table Vote (
     PostID int not null,
     Username varchar(50) not null,
     Value int not null,
     constraint IDVote primary key (PostID, Username));

create table Notification (
     Username varchar(50) not null,
     Link varchar(150) not null,
     Text varchar(150) not null,
     constraint IDNotification primary key (Username, Link));

-- Constraints Section
-- ___________________ 

alter table Answer add constraint FKAns_Pos
     foreign key (PostID)
     references Post (PostID);

alter table Answer add constraint FKAns_Com_FK
     foreign key (CommentID)
     references Comment (CommentID);

-- Not implemented
-- alter table Comment add constraint IDComment_CHK
--     check(exists(select * from SubComment
--                  where SubComment.Sub_CommentID = CommentID)); 

-- Not implemented
-- alter table Comment add constraint IDComment_CHK
--     check(exists(select * from Answer
--                  where Answer.CommentID = CommentID)); 

alter table Comment add constraint FKWrite
     foreign key (Username)
     references User (Username);

alter table Community add constraint FKFound
     foreign key (Username)
     references User (Username);

alter table Friendship add constraint FKFriend1
     foreign key (Username)
     references User (Username);

alter table Friendship add constraint FKFriend2
     foreign key (Fri_Username)
     references User (Username);

alter table `Join` add constraint FKJoi_Use
     foreign key (Username)
     references User (Username);

alter table `Join` add constraint FKJoi_Com
     foreign key (Name)
     references Community (Name);

alter table Message add constraint FKChat
     foreign key (Username, Fri_Username)
     references Friendship (Username, Fri_Username);

alter table Post add constraint FKIn
     foreign key (Name)
     references Community (Name);

alter table Post add constraint FKCreate
     foreign key (Username)
     references User (Username);

alter table Sessione add constraint FKGenera
     foreign key (Username)
     references User (Username);

alter table SubComment add constraint FKOrigin
     foreign key (CommentID)
     references Comment (CommentID);

alter table SubComment add constraint FKSub_FK
     foreign key (Sub_CommentID)
     references Comment (CommentID);

alter table Vote add constraint FKVot_Use
     foreign key (Username)
     references User (Username);

alter table Vote add constraint FKVot_Pos
     foreign key (PostID)
     references Post (PostID);

alter table Notification add constraint FKRecives
     foreign key (Username)
     references User (Username);


-- Database Filling

-- User Table

INSERT INTO `user`(`Username`, `Email`, `Password`, `FirstName`, `LastName`, `Gender`, `Biography`, `PersonalWebsite`, `Pfp`, `Phonenumbers`, `Tries`)
VALUES ('TestUser1','TestUserEmail1@mail.com','$2y$10$o9N6nGki62r5Ht1xutxY6OKnT4wVJOWbY8t6Kw1IrJ2QH0/ND7Pqu',
'Jhon','Smith','Male','Lorem ipsum','https://www.Fakesite1.com/',"media/users/placeholder.webp",'0000000001',0);

INSERT INTO `user`(`Username`, `Email`, `Password`, `FirstName`, `LastName`, `Gender`, `Biography`, `PersonalWebsite`, `Pfp`, `Phonenumbers`, `Tries`)
VALUES ('TestUser2','TestUserEmail2@mail.com','$2y$10$Tmm8baCvQKmp6dm1FWMa9.9BT6PMFuCC.fQoS1gXWlZD6O1YHAgQi',
'Jane','Smith','Female','Lorem ipsum','https://www.Fakesite2.com/',"media/users/placeholder.webp",'0000000002',0);

INSERT INTO `user`(`Username`, `Email`, `Password`, `FirstName`, `LastName`, `Gender`, `Biography`, `PersonalWebsite`, `Pfp`, `Phonenumbers`, `Tries`)
VALUES ('TestUser3','TestUserEmail3@mail.com','$2y$10$LxH8BVhSjfj7tlVttXY0EOq67YDZ62IMGmwejM6cvysB7IxWzRUNK',
'Jhon','Doe','Male','Lorem ipsum','https://www.Fakesite3.com/',"media/users/placeholder.webp",'0000000003',0);

INSERT INTO `user`(`Username`, `Email`, `Password`, `FirstName`, `LastName`, `Gender`, `Biography`, `PersonalWebsite`, `Pfp`, `Phonenumbers`, `Tries`)
VALUES ('TestUser4','TestUserEmail4@mail.com','$2y$10$NBUYkkZMwoJRM4XZxV2O5eB3Lvyi5mLtnOaB/FbuB4sir9pOzuvbO',
'Jane','Doe','Female','Lorem ipsum','https://www.Fakesite4.com/',"media/users/placeholder.webp",'0000000004',0);

INSERT INTO `user`(`Username`, `Email`, `Password`, `FirstName`, `LastName`, `Gender`, `Biography`, `PersonalWebsite`, `Pfp`, `Phonenumbers`, `Tries`)
VALUES ('TestUser5','TestUserEmail5@mail.com','$$2y$10$.eZOT6xQyjcg35ayjSfv/.R25ORjSf07yXrimVvFw/8xwLC/L6BEa',
'Linus','Torvald','Male','Lorem ipsum','https://www.Fakesite5.com/',"media/users/Linus.jpg",'0000000005',0);

INSERT INTO `user`(`Username`, `Email`, `Password`, `FirstName`, `LastName`, `Gender`, `Biography`, `PersonalWebsite`, `Pfp`, `Phonenumbers`, `Tries`)
VALUES ('TestUser6','TestUserEmail6@mail.com','$2y$10$DXbc2ZSfQ1QN6Ziky0uUHOotlxsxY/QtnIPrZ3lbXu7VnFDySwaD2',
'Jhonny','Bravo','Male','Lorem ipsum','https://www.Fakesite6.com/',"media/users/Bravo.jpg",'0000000006',0);

INSERT INTO `user`(`Username`, `Email`, `Password`, `FirstName`, `LastName`, `Gender`, `Biography`, `PersonalWebsite`, `Pfp`, `Phonenumbers`, `Tries`)
VALUES ('TestUser7','TestUserEmail7@mail.com','$2y$10$qK7.MYezykA2BcjuxVW/DOZ2k7XypStkKasW18BLVx/M3UKSPHY/e',
'Jhon','Price','Male','Lorem ipsum','https://www.Fakesite7.com/',"media/users/Price.jpg",'0000000007',0);

INSERT INTO `user`(`Username`, `Email`, `Password`, `FirstName`, `LastName`, `Gender`, `Biography`, `PersonalWebsite`, `Pfp`, `Phonenumbers`, `Tries`)
VALUES ('TestUser8','TestUserEmail8@mail.com','$2y$10$d7Sk/6fVQ04lAPmBx9vXP.1rModffCO96nYWqoGKupVK6g/AFcZnK',
'BT','7274','Robot','Lorem ipsum','https://www.Fakesite8.com/',"media/users/BT.jpg",'0000000008',0);

INSERT INTO `user`(`Username`, `Email`, `Password`, `FirstName`, `LastName`, `Gender`, `Biography`, `PersonalWebsite`, `Pfp`, `Phonenumbers`, `Tries`)
VALUES ('TestUser9','TestUserEmail9@mail.com','$$2y$10$YcVLPUtztn0oE6OOl60/..8f4Y5HdRAWTznSeUAFmR4oE6YmxA42G',
null,null,null,null,null,null,null,'0');

INSERT INTO `user`(`Username`, `Email`, `Password`, `FirstName`, `LastName`, `Gender`, `Biography`, `PersonalWebsite`, `Pfp`, `Phonenumbers`, `Tries`)
VALUES ('TestUser10','TestUserEmail10@mail.com','$2y$10$EeSTxtuQouu1WHvmVedi0uADACnQhAMbEczxKsWFCw15wpIs68GDO',
null,null,null,null,null,null,null,'0');

-- Friendship Table

INSERT INTO `friendship`(`Fri_Username`, `Username`) VALUES ('TestUser1','TestUser2');

INSERT INTO `friendship`(`Fri_Username`, `Username`) VALUES ('TestUser2','TestUser1');

INSERT INTO `friendship`(`Fri_Username`, `Username`) VALUES ('TestUser2','TestUser4');

INSERT INTO `friendship`(`Fri_Username`, `Username`) VALUES ('TestUser4','TestUser2');

INSERT INTO `friendship`(`Fri_Username`, `Username`) VALUES ('TestUser3','TestUser4');

INSERT INTO `friendship`(`Fri_Username`, `Username`) VALUES ('TestUser4','TestUser3');

-- Message Table

INSERT INTO `message`(`Username`, `Fri_Username`, `Timestamp`, `Text`) VALUES ('TestUser1','TestUser2','2024-2-5 15:00:00','Lorem Ipsum');

INSERT INTO `message`(`Username`, `Fri_Username`, `Timestamp`, `Text`) VALUES ('TestUser2','TestUser1','2024-2-5 15:01:00','Ipsum Lorem');

INSERT INTO `message`(`Username`, `Fri_Username`, `Timestamp`, `Text`) VALUES ('TestUser1','TestUser2','2024-2-6 15:10:00','Just bought a new game!');

INSERT INTO `message`(`Username`, `Fri_Username`, `Timestamp`, `Text`) VALUES ('TestUser1','TestUser2','2024-2-6 15:11:00','Want to play?');

INSERT INTO `message`(`Username`, `Fri_Username`, `Timestamp`, `Text`) VALUES ('TestUser2','TestUser1','2024-2-6 15:15:00','Sure!');

INSERT INTO `message`(`Username`, `Fri_Username`, `Timestamp`, `Text`) VALUES ('TestUser2','TestUser4','2024-2-6 22:20:15',"I'm playing with Jhon wanna join?");

INSERT INTO `message`(`Username`, `Fri_Username`, `Timestamp`, `Text`) VALUES ('TestUser4','TestUser2','2024-2-6 22:30:47','Sure!');

INSERT INTO `message`(`Username`, `Fri_Username`, `Timestamp`, `Text`) VALUES ('TestUser3','TestUser4','2024-2-6 23:30:00','Heyo!');

-- Community Table

INSERT INTO `community`(`Name`, `Image`, `Description`, `Username`) VALUES ('LinuxUsers',"media/users/LinuxUsers.jpg",'For Linux users from Linux users','TestUser5');

INSERT INTO `community`(`Name`, `Image`, `Description`, `Username`) VALUES ('Cartoon Network Generation',"media/users/CartoonNetworkLogo.png",'A community for people who grewn up with Cartoon Network show','TestUser6');

INSERT INTO `community`(`Name`, `Image`, `Description`, `Username`) VALUES ('Call of Duty MLG',"media/users/CallOfDutyLogo.png",'A Call of Duty competitive community','TestUser7');

INSERT INTO `community`(`Name`, `Image`, `Description`, `Username`) VALUES ('Titanfall 2',"media/users/Titanfall2Logo.png",'Get ready for Titanfall!','TestUser8');

-- Join Table

INSERT INTO `join`(`Name`, `Username`) VALUES ('LinuxUsers','TestUser5');

INSERT INTO `join`(`Name`, `Username`) VALUES ('LinuxUsers','TestUser1');

INSERT INTO `join`(`Name`, `Username`) VALUES ('LinuxUsers','TestUser2');

INSERT INTO `join`(`Name`, `Username`) VALUES ('LinuxUsers','TestUser3');

INSERT INTO `join`(`Name`, `Username`) VALUES ('LinuxUsers','TestUser4');

INSERT INTO `join`(`Name`, `Username`) VALUES ('Cartoon Network Generation','TestUser6');

INSERT INTO `join`(`Name`, `Username`) VALUES ('Cartoon Network Generation','TestUser1');

INSERT INTO `join`(`Name`, `Username`) VALUES ('Cartoon Network Generation','TestUser2');

INSERT INTO `join`(`Name`, `Username`) VALUES ('Cartoon Network Generation','TestUser3');

INSERT INTO `join`(`Name`, `Username`) VALUES ('Cartoon Network Generation','TestUser4');

INSERT INTO `join`(`Name`, `Username`) VALUES ('Call of Duty MLG','TestUser7');

INSERT INTO `join`(`Name`, `Username`) VALUES ('Call of Duty MLG','TestUser1');

INSERT INTO `join`(`Name`, `Username`) VALUES ('Call of Duty MLG','TestUser2');

INSERT INTO `join`(`Name`, `Username`) VALUES ('Call of Duty MLG','TestUser3');

INSERT INTO `join`(`Name`, `Username`) VALUES ('Call of Duty MLG','TestUser4');

INSERT INTO `join`(`Name`, `Username`) VALUES ('Titanfall 2','TestUser5');

INSERT INTO `join`(`Name`, `Username`) VALUES ('Titanfall 2','TestUser1');

INSERT INTO `join`(`Name`, `Username`) VALUES ('Titanfall 2','TestUser2');

INSERT INTO `join`(`Name`, `Username`) VALUES ('Titanfall 2','TestUser3');

INSERT INTO `join`(`Name`, `Username`) VALUES ('Titanfall 2','TestUser4');

-- Post Table

INSERT INTO `post`(`PostID`, `Date`, `Content`, `Likes`, `Title`, `Image`, `Name`, `Username`)
VALUES (1,'2024-02-05','Just installed my new Ubuntu distro',0,'New Linux User', "media/users/Ubuntu.png",'LinuxUsers','TestUser1');

INSERT INTO `post`(`PostID`, `Date`, `Content`, `Likes`, `Title`, `Image`, `Name`, `Username`)
VALUES (2,'2024-02-06','I really love linux it feels amazing',0,'First Impressions',"media/users/Ubuntu.png",'LinuxUsers','TestUser1');

INSERT INTO `post`(`PostID`, `Date`, `Content`, `Likes`, `Title`, `Image`, `Name`, `Username`)
VALUES (3,'2024-02-06','My favourite one is Jack Cooper',0,"What's your favourite character?","media/users/JackCooper.jpg",'Titanfall 2','TestUser2');

INSERT INTO `post`(`PostID`, `Date`, `Content`, `Likes`, `Title`, `Image`, `Name`, `Username`)
VALUES (4,'2024-02-07',"I'm still downloading it",0,"Has anyone tried the new update?",null,'Call of Duty MLG','TestUser3');

-- Post Answer Table

INSERT INTO `comment`(`CommentID`, `Date`, `Content`, `Username`) VALUES (1,'2024-02-05','Welcome to the family','TestUser5');
INSERT INTO `answer`(`CommentID`, `PostID`) VALUES (1,1);

INSERT INTO `comment`(`CommentID`, `Date`, `Content`, `Username`) VALUES (2,'2024-02-06','Nice to hear','TestUser5');
INSERT INTO `answer`(`CommentID`, `PostID`) VALUES (2,2);

INSERT INTO `comment`(`CommentID`, `Date`, `Content`, `Username`) VALUES (3,'2024-02-06','Mine is BT','TestUser8');
INSERT INTO `answer`(`CommentID`, `PostID`) VALUES (3,3);

INSERT INTO `comment`(`CommentID`, `Date`, `Content`, `Username`) VALUES (4,'2024-02-06','Mine is Valkyre','TestUser1');
INSERT INTO `answer`(`CommentID`, `PostID`) VALUES (4,3);

INSERT INTO `comment`(`CommentID`, `Date`, `Content`, `Username`) VALUES (5,'2024-02-06',"Yeah it's fire",'TestUser4');
INSERT INTO `answer`(`CommentID`, `PostID`) VALUES (5,4);

-- Subcomment Table

INSERT INTO `comment`(`CommentID`, `Date`, `Content`, `Username`) VALUES (6,'2024-02-06','Are you the real Linus???','TestUser1');
INSERT INTO `subcomment`(`Sub_CommentID`, `CommentID`) VALUES (6,1);

INSERT INTO `comment`(`CommentID`, `Date`, `Content`, `Username`) VALUES (7,'2024-02-06','Maybe :)','TestUser5');
INSERT INTO `subcomment`(`Sub_CommentID`, `CommentID`) VALUES (7,6);

INSERT INTO `comment`(`CommentID`, `Date`, `Content`, `Username`) VALUES (8,'2024-02-06','Wow you too!','TestUser3');
INSERT INTO `subcomment`(`Sub_CommentID`, `CommentID`) VALUES (8,1);

-- Vote Table

INSERT INTO `vote`(`PostID`, `Username`, `Value`) VALUES (1,'TestUser1',1);

INSERT INTO `vote`(`PostID`, `Username`, `Value`) VALUES (1,'TestUser2',0);

INSERT INTO `vote`(`PostID`, `Username`, `Value`) VALUES (1,'TestUser3',1);

INSERT INTO `vote`(`PostID`, `Username`, `Value`) VALUES (1,'TestUser4',1);

INSERT INTO `vote`(`PostID`, `Username`, `Value`) VALUES (1,'TestUser5',1);

INSERT INTO `vote`(`PostID`, `Username`, `Value`) VALUES (2,'TestUser1',1);

INSERT INTO `vote`(`PostID`, `Username`, `Value`) VALUES (2,'TestUser5',1);

INSERT INTO `vote`(`PostID`, `Username`, `Value`) VALUES (3,'TestUser8',1);

INSERT INTO `vote`(`PostID`, `Username`, `Value`) VALUES (3,'TestUser1',1);

INSERT INTO `vote`(`PostID`, `Username`, `Value`) VALUES (3,'TestUser2',1);
