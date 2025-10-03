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

-- INSERT INTO User (firstName, username, email, encrypted_password)
-- VALUES
-- ('Alice', 'alice01', 'alice@example.com', 'pass1'),
-- ('Bob', 'bobby22', 'bob@example.com', 'pass2'),
-- ('Charlie', 'charlie_c', 'charlie@example.com', 'pass3'),
-- ('Dana', 'dana_4', 'dana@example.com', 'pass4'),
-- ('Eli', 'eli89', 'eli@example.com', 'pass5'),
-- ('Fiona', 'fifi', 'fiona@example.com', 'pass6'),
-- ('George', 'geo7', 'george@example.com', 'pass7'),
-- ('Hannah', 'hannie', 'hannah@example.com', 'pass8'),
-- ('Ian', 'ian88', 'ian@example.com', 'pass9'),
-- ('Jane', 'jane_doe', 'jane@example.com', 'pass10'),
-- ('Kyle', 'kyle_k', 'kyle@example.com', 'pass11'),
-- ('Laura', 'laurie', 'laura@example.com', 'pass12'),
-- ('Mike', 'mikey', 'mike@example.com', 'pass13'),
-- ('Nina', 'nina_star', 'nina@example.com', 'pass14'),
-- ('Oscar', 'ozzy', 'oscar@example.com', 'pass15'),
-- ('Paula', 'paula123', 'paula@example.com', 'pass16'),
-- ('Quinn', 'quinnie', 'quinn@example.com', 'pass17'),
-- ('Rita', 'rita_r', 'rita@example.com', 'pass18'),
-- ('Steve', 'steve_rocks', 'steve@example.com', 'pass19'),
-- ('Tina', 'tina_b', 'tina@example.com', 'pass20');

-- INSERT INTO QuestionnaireResponse (userID, question_one, question_two, question_three) VALUES
-- (1, 3, 2, 4),
-- (2, 4, 3, 2),
-- (3, 5, 1, 5),
-- (4, 2, 2, 3),
-- (5, 1, 3, 4),
-- (6, 2, 4, 5),
-- (7, 3, 3, 2),
-- (8, 4, 1, 3),
-- (9, 5, 5, 1),
-- (10, 2, 4, 4),
-- (11, 1, 2, 5),
-- (12, 3, 1, 1),
-- (13, 4, 2, 2),
-- (14, 2, 3, 3),
-- (15, 5, 4, 4),
-- (16, 1, 5, 5),
-- (17, 2, 1, 2),
-- (18, 3, 2, 1),
-- (19, 4, 3, 3),
-- (20, 5, 5, 5);

-- INSERT INTO Week (weekID, week_start, week_end) VALUES
-- (1, '2025-09-01', '2025-09-07'),
-- (2, '2025-09-08', '2025-09-14'),
-- (3, '2025-09-15', '2025-09-21'),
-- (4, '2025-09-22', '2025-09-28'),
-- (5, '2025-09-29', '2025-10-05'),
-- (6, '2025-10-06', '2025-10-12'),
-- (7, '2025-10-13', '2025-10-19'),
-- (8, '2025-10-20', '2025-10-26'),
-- (9, '2025-10-27', '2025-11-02'),
-- (10, '2025-11-03', '2025-11-09'),
-- (11, '2025-11-10', '2025-11-16'),
-- (12, '2025-11-17', '2025-11-23'),
-- (13, '2025-11-24', '2025-11-30'),
-- (14, '2025-12-01', '2025-12-07'),
-- (15, '2025-12-08', '2025-12-14'),
-- (16, '2025-12-15', '2025-12-21'),
-- (17, '2025-12-22', '2025-12-28'),
-- (18, '2025-12-29', '2026-01-04'),
-- (19, '2026-01-05', '2026-01-11'),
-- (20, '2026-01-12', '2026-01-18');

-- INSERT INTO Month (monthID, month_start, month_end) VALUES
-- (1, '2025-01-01', '2025-01-31'),
-- (2, '2025-02-01', '2025-02-28'),
-- (3, '2025-03-01', '2025-03-31'),
-- (4, '2025-04-01', '2025-04-30'),
-- (5, '2025-05-01', '2025-05-31'),
-- (6, '2025-06-01', '2025-06-30'),
-- (7, '2025-07-01', '2025-07-31'),
-- (8, '2025-08-01', '2025-08-31'),
-- (9, '2025-09-01', '2025-09-30'),
-- (10, '2025-10-01', '2025-10-31'),
-- (11, '2025-11-01', '2025-11-30'),
-- (12, '2025-12-01', '2025-12-31'),
-- (13, '2026-01-01', '2026-01-31'),
-- (14, '2026-02-01', '2026-02-28'),
-- (15, '2026-03-01', '2026-03-31'),
-- (16, '2026-04-01', '2026-04-30'),
-- (17, '2026-05-01', '2026-05-31'),
-- (18, '2026-06-01', '2026-06-30'),
-- (19, '2026-07-01', '2026-07-31'),
-- (20, '2026-08-01', '2026-08-31');

-- INSERT INTO ActivityKey (activityID, activity_name, value_points) VALUES
-- (1, 'Bike to work', 10),
-- (2, 'Recycle plastic', 5),
-- (3, 'Use reusable bag', 3),
-- (4, 'Public transport', 7),
-- (5, 'Plant a tree', 15),
-- (6, 'Carpool', 6),
-- (7, 'Avoid meat', 8),
-- (8, 'Use solar panel', 20),
-- (9, 'Compost', 4),
-- (10, 'Pick up litter', 6),
-- (11, 'Eco shower', 2),
-- (12, 'Eco laundry', 3),
-- (13, 'Use LED lights', 5),
-- (14, 'Donate clothes', 6),
-- (15, 'Paperless billing', 4),
-- (16, 'No plastic bottles', 5),
-- (17, 'Home insulation', 12),
-- (18, 'Energy audit', 10),
-- (19, 'Eco-friendly commute', 7),
-- (20, 'Grow vegetables', 9);

-- INSERT INTO UserActivity (userID, activityID) VALUES
-- (1, 1),
-- (2, 2),
-- (3, 3),
-- (4, 4),
-- (5, 5),
-- (6, 6),
-- (7, 7),
-- (8, 8),
-- (9, 9),
-- (10, 10),
-- (11, 11),
-- (12, 12),
-- (13, 13),
-- (14, 14),
-- (15, 15),
-- (16, 16),
-- (17, 17),
-- (18, 18),
-- (19, 19),
-- (20, 20);

-- INSERT INTO EcoCounter (userID, weekID, monthID, activityID, positive_activity) VALUES
-- (1, 1, 9, 1, TRUE),
-- (2, 2, 9, 2, TRUE),
-- (3, 3, 9, 3, FALSE),
-- (4, 4, 9, 4, TRUE),
-- (5, 5, 10, 5, TRUE),
-- (6, 6, 10, 6, TRUE),
-- (7, 7, 10, 7, FALSE),
-- (8, 8, 10, 8, TRUE),
-- (9, 9, 11, 9, TRUE),
-- (10, 10, 11, 10, TRUE),
-- (11, 11, 11, 11, FALSE),
-- (12, 12, 11, 12, TRUE),
-- (13, 13, 12, 13, TRUE),
-- (14, 14, 12, 14, FALSE),
-- (15, 15, 12, 15, TRUE),
-- (16, 16, 12, 16, TRUE),
-- (17, 17, 13, 17, TRUE),
-- (18, 18, 13, 18, FALSE),
-- (19, 19, 13, 19, TRUE),
-- (20, 20, 13, 20, TRUE);

-- for month
CREATE VIEW month_leaderboard as SELECT
    u.username,
    COALESCE(SUM(CASE 
            WHEN ec.positive_activity = TRUE THEN a.value_points
            ELSE -a.value_points
        END)) AS totalPoints
FROM EcoCounter ec
JOIN ActivityKey a ON ec.activityID = a.activityID
JOIN User u ON ec.userID = u.userID
WHERE ec.monthID = (
    SELECT monthID FROM Month 
    WHERE CURRENT_DATE BETWEEN month_start AND month_end
)
AND ec.positive_activity = TRUE
GROUP BY u.username
ORDER BY totalPoints DESC;

-- for week
CREATE VIEW week_leaderboard AS
SELECT 
    u.username,
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

-- INSERT INTO EcoCounter (userID, weekID, monthID, activityID, positive_activity) VALUES
-- (1, 5, 9, 1, TRUE),
-- (1, 5, 9, 2, FALSE),
-- (2, 5, 9, 3, TRUE),
-- (2, 5, 9, 4, TRUE),
-- (3, 5, 9, 5, TRUE),
-- (3, 5, 9, 6, FALSE),
-- (4, 5, 9, 7, TRUE),
-- (4, 5, 9, 8, TRUE),
-- (5, 5, 9, 9, FALSE),
-- (5, 5, 9, 10, TRUE),
-- (6, 5, 9, 11, TRUE),
-- (6, 5, 9, 12, FALSE),
-- (7, 5, 9, 13, TRUE),
-- (7, 5, 9, 14, TRUE),
-- (8, 5, 9, 15, FALSE),
-- (8, 5, 9, 16, TRUE),
-- (9, 5, 9, 17, TRUE),
-- (9, 5, 9, 18, FALSE),
-- (10, 5, 9, 19, TRUE),
-- (10, 5, 9, 20, TRUE),
-- (11, 5, 9, 1, FALSE),
-- (11, 5, 9, 2, TRUE),
-- (12, 5, 9, 3, TRUE),
-- (12, 5, 9, 4, TRUE),
-- (13, 5, 9, 5, TRUE),
-- (13, 5, 9, 6, FALSE),
-- (14, 5, 9, 7, TRUE),
-- (14, 5, 9, 8, TRUE),
-- (15, 5, 9, 9, TRUE),
-- (15, 5, 9, 10, FALSE),
-- (16, 5, 9, 11, TRUE),
-- (16, 5, 9, 12, TRUE),
-- (17, 5, 9, 13, FALSE),
-- (17, 5, 9, 14, TRUE),
-- (18, 5, 9, 15, TRUE),
-- (18, 5, 9, 16, TRUE),
-- (19, 5, 9, 17, FALSE),
-- (19, 5, 9, 18, TRUE);

	   