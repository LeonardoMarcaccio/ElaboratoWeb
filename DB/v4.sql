-- *********************************************
-- * SQL MySQL generation                      
-- *--------------------------------------------
-- * DB-MAIN version: 11.0.2              
-- * Generator date: Sep 14 2021              
-- * Generation date: Mon Jan 29 22:14:51 2024 
-- * LUN file: C:\xampp\htdocs\Elab\DB\PlayPal.lun 
-- * Schema: PlayPal/1-2-4 
-- ********************************************* 


-- Database Section
-- ________________ 

create database PlayPal;
use PlayPal;


-- Tables Section
-- _____________ 

create table Comment (
     Username char(1) not null,
     Date date not null);

create table Community (
     Name char(1) not null,
     Image varchar(100) not null,
     Description varchar(500) not null,
     Username char(1) not null,
     Adm_Username char(1) not null,
     constraint IDCommuity primary key (Name));

create table Friendship (
     Fri_Username char(1) not null,
     Username char(1) not null,
     constraint IDFriendship primary key (Username, Fri_Username));

create table `Join` (
     Username char(1) not null,
     Name char(1) not null,
     constraint IDJoin primary key (Name, Username));

create table Message (
     Username char(1) not null,
     Fri_Username char(1) not null,
     Sender char(1) not null,
     Timestamp date not null,
     Text varchar(500) not null,
     constraint IDMessage primary key (Username, Fri_Username, Sender, Timestamp));

create table Post (
     Title varchar(50) not null,
     Image varchar(100),
     Tags varchar(15),
     Name char(1) not null);

create table Sessione (
     Token varchar(50) not null,
     Username char(1) not null,
     Gen_Username char(1) not null);

create table Thread (
     Username char(1) not null,
     Date date not null,
     Content varchar(500) not null,
     constraint IDThread primary key (Username, Date));

create table User (
     Username varchar(50) not null,
     Email varchar(30) not null,
     Password varchar(30) not null,
     FirstName varchar(30),
     LastName varchar(30),
     Gender varchar(20),
     Biography varchar(20),
     PersonalWebsite varchar(100),
     Pfp varchar(2083),
     Phonenumbers varchar(15),
     Tries int default 0 not null,
     constraint IDUser primary key (Username));


-- Constraints Section
-- ___________________ 

alter table Comment add constraint FKAnswer
     foreign key (Username, Date)
     references Thread (Username, Date);

alter table Community add constraint FKFound
     foreign key (Username)
     references User (Username);

alter table Community add constraint FKAdmin
     foreign key (Adm_Username)
     references User (Username);

alter table Friendship add constraint FKFriend1
     foreign key (Username)
     references User (Username);

alter table Friendship add constraint FKFriend2
     foreign key (Fri_Username)
     references User (Username);

alter table `Join` add constraint FKJoi_Com
     foreign key (Name)
     references Community (Name);

alter table `Join` add constraint FKJoi_Use
     foreign key (Username)
     references User (Username);

alter table Message add constraint FKChat
     foreign key (Username, Fri_Username)
     references Friendship (Username, Fri_Username);

alter table Post add constraint FKIn
     foreign key (Name)
     references Community (Name);

alter table Sessione add constraint FKGenera
     foreign key (Gen_Username)
     references User (Username);

alter table Thread add constraint FKCrea
     foreign key (Username)
     references User (Username);


-- Index Section
-- _____________ 
