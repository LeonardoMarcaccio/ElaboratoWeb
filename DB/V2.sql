-- *********************************************
-- * SQL MySQL generation                      
-- *--------------------------------------------
-- * DB-MAIN version: 11.0.2              
-- * Generator date: Sep 14 2021              
-- * Generation date: Mon Jan 22 16:46:41 2024 
-- * LUN file: C:\xampp\htdocs\Elab\DB\PlayPal.lun 
-- * Schema: PlayPal/1-2-2 
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

create table Commuity (
     Name char(1) not null,
     Image varchar(100) not null,
     Description varchar(500) not null,
     Username char(1) not null,
     Fou_Username char(1) not null,
     constraint IDCommuity primary key (Name));

create table Frindship (
     Fri_Username char(1) not null,
     Username char(1) not null,
     constraint IDFrindship primary key (Fri_Username, Username));

create table Join (
     Username char(1) not null,
     Name char(1) not null,
     constraint IDJoin primary key (Name, Username));

create table Message (
     Fri_Username char(1) not null,
     Username char(1) not null,
     Sender char(1) not null,
     Timestamp date not null,
     Text varchar(500) not null,
     constraint IDMessage primary key (Fri_Username, Username, Sender, Timestamp));

create table Post (
     Title varchar(50) not null,
     Image varchar(100),
     Tags varchar(15),
     Name char(1) not null);

create table Thread (
     Username char(1) not null,
     Date date not null,
     Content varchar(500) not null,
     constraint IDThread primary key (Username, Date));

create table User (
     Username char(1) not null,
     Email varchar(30) not null,
     Password varchar(30) not null,
     First Name varchar(30),
     Last Name varchar(30),
     Gender varchar(20),
     Biography varchar(20),
     Personal Website varchar(100),
     Pfp varchar(100),
     Phonenumbers varchar(15),
     constraint IDUser primary key (Username));


-- Constraints Section
-- ___________________ 

alter table Comment add constraint FKAnswer
     foreign key (Username, Date)
     references Thread (Username, Date);

alter table Commuity add constraint FKAdmin
     foreign key (Username)
     references User (Username);

alter table Commuity add constraint FKFound
     foreign key (Fou_Username)
     references User (Username);

alter table Frindship add constraint FKFriend2
     foreign key (Username)
     references User (Username);

alter table Frindship add constraint FKFriend1
     foreign key (Fri_Username)
     references User (Username);

alter table Join add constraint FKJoi_Com
     foreign key (Name)
     references Commuity (Name);

alter table Join add constraint FKJoi_Use
     foreign key (Username)
     references User (Username);

alter table Message add constraint FKChat
     foreign key (Fri_Username, Username)
     references Frindship (Fri_Username, Username);

alter table Post add constraint FKIn
     foreign key (Name)
     references Commuity (Name);

alter table Thread add constraint FKCrea
     foreign key (Username)
     references User (Username);


-- Index Section
-- _____________ 

