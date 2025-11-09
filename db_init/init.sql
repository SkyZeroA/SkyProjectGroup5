CREATE DATABASE IF NOT EXISTS SkyZeroDB;
USE SkyZeroDB;

CREATE TABLE IF NOT EXISTS User (
	userID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    avatarFilename VARCHAR(250) UNIQUE,
    encrypted_password VARCHAR(100) NOT NULL,
    tips JSON
);

CREATE TABLE IF NOT EXISTS QuestionnaireResponse (
    responseID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    dateSubmitted DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    transportMethod INT NOT NULL,   
    travelDistance INT NOT NULL,    
    officeDays INT NOT NULL,        
    dietDays INT NOT NULL,     
    meats INT NOT NULL,      
    heatingHours INT NOT NULL,
    turnOffDevices INT NOT NULL,
    recycle INT NOT NULL,
    reusable INT NOT NULL,
    foodWaste INT NOT NULL,
    FOREIGN KEY(userID) REFERENCES User(userID)
);


CREATE TABLE IF NOT EXISTS Week (
	weekID INT NOT NULL PRIMARY KEY,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL
);


CREATE TABLE IF NOT EXISTS Month (
	monthID INT NOT NULL PRIMARY KEY,
    month_start DATE NOT NULL,
    month_end DATE NOT NULL
);


CREATE TABLE IF NOT EXISTS ActivityKey (
	activityID INT NOT NULL PRIMARY KEY,
    activity_name VARCHAR(50) NOT NULL,
    value_points INT NOT NULL
);

CREATE TABLE IF NOT EXISTS UserActivity (
	userID INT NOT NULL,
    activityID INT NOT NULL,
    FOREIGN KEY (userID) REFERENCES User(userID), 
    FOREIGN KEY (activityID) REFERENCES ActivityKey(activityID),
    PRIMARY KEY (userID, activityID)
);

CREATE TABLE IF NOT EXISTS EcoCounter (
    ecoID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    weekID INT NOT NULL,
    monthID INT NOT NULL,
    activityID INT NOT NULL,
    positive_activity BOOL NOT NULL,
    date_done DATE NOT NULL DEFAULT (CURRENT_DATE),
    FOREIGN KEY (userID) REFERENCES User(userID), 
    FOREIGN KEY (weekID) REFERENCES Week(weekID), 
    FOREIGN KEY (monthID) REFERENCES Month(monthID), 
    FOREIGN KEY (activityID) REFERENCES ActivityKey(activityID)
);


INSERT IGNORE INTO Week (weekID, week_start, week_end) VALUES
(1, '2025-01-06', '2025-01-12'),
(2, '2025-01-13', '2025-01-19'),
(3, '2025-01-20', '2025-01-26'),
(4, '2025-01-27', '2025-02-02'),
(5, '2025-02-03', '2025-02-09'),
(6, '2025-02-10', '2025-02-16'),
(7, '2025-02-17', '2025-02-23'),
(8, '2025-02-24', '2025-03-02'),
(9, '2025-03-03', '2025-03-09'),
(10, '2025-03-10', '2025-03-16'),
(11, '2025-03-17', '2025-03-23'),
(12, '2025-03-24', '2025-03-30'),
(13, '2025-03-31', '2025-04-06'),
(14, '2025-04-07', '2025-04-13'),
(15, '2025-04-14', '2025-04-20'),
(16, '2025-04-21', '2025-04-27'),
(17, '2025-04-28', '2025-05-04'),
(18, '2025-05-05', '2025-05-11'),
(19, '2025-05-12', '2025-05-18'),
(20, '2025-05-19', '2025-05-25'),
(21, '2025-05-26', '2025-06-01'),
(22, '2025-06-02', '2025-06-08'),
(23, '2025-06-09', '2025-06-15'),
(24, '2025-06-16', '2025-06-22'),
(25, '2025-06-23', '2025-06-29'),
(26, '2025-06-30', '2025-07-06'),
(27, '2025-07-07', '2025-07-13'),
(28, '2025-07-14', '2025-07-20'),
(29, '2025-07-21', '2025-07-27'),
(30, '2025-07-28', '2025-08-03'),
(31, '2025-08-04', '2025-08-10'),
(32, '2025-08-11', '2025-08-17'),
(33, '2025-08-18', '2025-08-24'),
(34, '2025-08-25', '2025-08-31'),
(35, '2025-09-01', '2025-09-07'),
(36, '2025-09-08', '2025-09-14'),
(37, '2025-09-15', '2025-09-21'),
(38, '2025-09-22', '2025-09-28'),
(39, '2025-09-29', '2025-10-05'),
(40, '2025-10-06', '2025-10-12'),
(41, '2025-10-13', '2025-10-19'),
(42, '2025-10-20', '2025-10-26'),
(43, '2025-10-27', '2025-11-02'),
(44, '2025-11-03', '2025-11-09'),
(45, '2025-11-10', '2025-11-16'),
(46, '2025-11-17', '2025-11-23'),
(47, '2025-11-24', '2025-11-30'),
(48, '2025-12-01', '2025-12-07'),
(49, '2025-12-08', '2025-12-14'),
(50, '2025-12-15', '2025-12-21'),
(51, '2025-12-22', '2025-12-28'),
(52, '2025-12-29', '2026-01-04');


INSERT IGNORE INTO Month (monthID, month_start, month_end) VALUES
(1, '2025-01-01', '2025-01-31'),
(2, '2025-02-01', '2025-02-28'),
(3, '2025-03-01', '2025-03-31'),
(4, '2025-04-01', '2025-04-30'),
(5, '2025-05-01', '2025-05-31'),
(6, '2025-06-01', '2025-06-30'),
(7, '2025-07-01', '2025-07-31'),
(8, '2025-08-01', '2025-08-31'),
(9, '2025-09-01', '2025-09-30'),
(10, '2025-10-01', '2025-10-31'),
(11, '2025-11-01', '2025-11-30'),
(12, '2025-12-01', '2025-12-31');

/* Activities Points Breakdown

Assumptions:
- Avg commute distance: 20 km https://mobilityways.com/cost-of-living-and-commuter-trends/
- Avoiding meat uses an avg of all the meat options from the questionnaire
  10.0, 8.0, 2.0, 1.6, 2.4, 1.4 = 25.4 / 6 = ~4.23 kg CO2 saved per day
- Avg hours of heating saved per day when turning off heating: 5hrs https://heatable.co.uk/boiler-advice/how-many-hours-a-day-should-heating-be-on

Bike to work: 0.25 kg/km * 20 km = 5 kg/day -> 10 points     
Day without Heating On: 2 kg/hr * 5 hrs = 10 kg/day -> 20 points
Lower heating by 1°C: 1 kg/day -> 2 point        
Walk to work: 0.25 kg/km * 20 km = 5 kg/day -> 10 points
Public transport: (0.25 - 0.05) * 32 km = 6.4 kg/day -> 13 points
Extra WFH day: 0.25 kg/km * 32 km = 8 kg/day -> 16 points
Carpool w 1 other: 0.25 * 32 km * 0.5 = 4 kg/day -> 8 points
Avoid meat: 4.23 kg/day -> 8 points
Take stairs instead of elevator: 0.2 kg/day -> 1 point
Reusable water bottle: 0.05 kg/day -> 1 point
Air dry over tumble dry: 0.5 kg/day -> 1 point
Reusable shopping bags: 0.02 kg/day -> 1 point
Donate items: 0.2 kg/day -> 1 point
Recycle plastic, can or glass: 0.05 kg/day -> 1 point
Buy second-hand item: 0.8 kg/day -> 2 points

*/

INSERT IGNORE INTO ActivityKey (activityID, activity_name, value_points) VALUES
(1, 'Bike to work', 10),
(2, 'Day without Heating On', 20),
(3, 'Walk to work', 10),
(4, 'Public transport', 13),
(5, 'Extra WFH day', 16),
(6, 'Carpool w 1 other', 8),
(7, 'Avoid meat', 8),
(8, 'Take stairs instead of elevator', 1),
(9, 'Reusable water bottle', 1),
(10, 'Air dry over tumble dry', 1),
(11, 'Reusable shopping bags', 1),
(12, 'Donate items', 1),
(13, 'Recycle plastic, can or glass', 1),
(14, 'Buy second-hand item', 2),
(15, 'Lower heating by 1°C', 2);


-- For Month
CREATE OR REPLACE VIEW month_leaderboard AS
SELECT
    u.username,
    u.avatarFilename,
    COALESCE(SUM(CASE
        WHEN ec.positive_activity = TRUE THEN a.value_points
        WHEN ec.positive_activity = FALSE THEN -a.value_points
    END), 0) AS totalPoints
FROM User u
LEFT JOIN EcoCounter ec
    ON u.userID = ec.userID
    AND ec.monthID = (
        SELECT monthID FROM Month
        WHERE CURRENT_DATE BETWEEN month_start AND month_end
    )
LEFT JOIN ActivityKey a ON ec.activityID = a.activityID
GROUP BY u.username
ORDER BY totalPoints DESC;

-- For Week
CREATE OR REPLACE VIEW week_leaderboard AS
SELECT
    u.username,
    u.avatarFilename,
    COALESCE(SUM(CASE
        WHEN ec.positive_activity = TRUE THEN a.value_points
        WHEN ec.positive_activity = FALSE THEN -a.value_points
    END), 0) AS totalPoints
FROM User u
LEFT JOIN EcoCounter ec
    ON u.userID = ec.userID
    AND ec.weekID = (
        SELECT weekID FROM Week
        WHERE CURRENT_DATE BETWEEN week_start AND week_end
    )
LEFT JOIN ActivityKey a ON ec.activityID = a.activityID
GROUP BY u.username
ORDER BY totalPoints DESC;