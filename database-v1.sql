CREATE DATABASE SkyZeroDB;
USE SkyZeroDB;

CREATE TABLE User (
	userID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    encrypted_password VARCHAR(100) NOT NULL
);

CREATE TABLE QuestionnaireResponse (
	userID INT NOT NULL PRIMARY KEY,
    question_one INT NOT NULL,
    question_two INT NOT NULL,
    question_three INT NOT NULL,
    FOREIGN KEY(userID) REFERENCES User(userID)
);

CREATE TABLE Week (
	weekID INT NOT NULL PRIMARY KEY,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL
);


CREATE TABLE Month (
	monthID INT NOT NULL PRIMARY KEY,
    month_start DATE NOT NULL,
    month_end DATE NOT NULL
);


CREATE TABLE ActivityKey (
	activityID INT NOT NULL PRIMARY KEY,
    activity_name VARCHAR(50) NOT NULL,
    value_points INT NOT NULL
);

CREATE TABLE UserActivity (
	userID INT NOT NULL,
    activityID INT NOT NULL,
    FOREIGN KEY (userID) REFERENCES User(userID), 
    FOREIGN KEY (activityID) REFERENCES ActivityKey(activityID),
    PRIMARY KEY (userID, activityID)
);

CREATE TABLE EcoCounter (
	ecoID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    weekID INT NOT NULL,
    monthID INT NOT NULL,
    activityID INT NOT NULL,
    positive_activity BOOL NOT NULL,
    FOREIGN KEY (userID) REFERENCES User(userID), 
    FOREIGN KEY (weekID) REFERENCES Week(weekID), 
	FOREIGN KEY (monthID) REFERENCES Month(monthID), 
    FOREIGN KEY (activityID) REFERENCES ActivityKey(activityID)
);