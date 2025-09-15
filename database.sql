CREATE DATABASE SkyZeroDB;
USE SkyZeroDB;

CREATE TABLE User (
	userID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    passwordHash VARCHAR(255) NOT NULL
);

CREATE TABLE QuestionnaireResponse (
	userID INT NOT NULL PRIMARY KEY,
    transportMethod INT NOT NULL,
    remoteDays INT NOT NULL,
    commuteDistance INT NOT NULL,
    FOREIGN KEY(userID) REFERENCES User(userID)
);

CREATE TABLE Leaderboard (
	userID INT NOT NULL PRIMARY KEY,
    score INT NOT NULL,
    projectedFootprint INT NOT NULL,
    FOREIGN KEY(userID) REFERENCES User(userID)
);