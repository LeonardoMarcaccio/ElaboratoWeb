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

create database PlayPal;
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
     Timestamp date not null,
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

-- Not implemented
-- alter table Post add constraint IDPost_CHK
--     check(exists(select * from Tagged
--                  where Tagged.PostID = PostID)); 

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


-- Index Section
-- _____________ 

