USE SkyZeroDB;


INSERT IGNORE INTO User (firstName, username, email, encrypted_password)
VALUES
('Alice', 'alice01', 'alice@example.com', 'pass1'),
('Bob', 'bobby22', 'bob@example.com', 'pass2'),
('Charlie', 'charlie_c', 'charlie@example.com', 'pass3'),
('Dana', 'dana_4', 'dana@example.com', 'pass4'),
('Eli', 'eli89', 'eli@example.com', 'pass5'),
('Fiona', 'fifi', 'fiona@example.com', 'pass6'),
('George', 'geo7', 'george@example.com', 'pass7'),
('Hannah', 'hannie', 'hannah@example.com', 'pass8'),
('Test', 'tester', 'test@sky.uk', 'Password1!'),
('Ian', 'ian88', 'ian@example.com', 'pass9'),
('Kyle', 'kyle_k', 'kyle@example.com', 'pass11'),
('Laura', 'laurie', 'laura@example.com', 'pass12'),
('Mike', 'mikey', 'mike@example.com', 'pass13'),
('Nina', 'nina_star', 'nina@example.com', 'pass14'),
('Oscar', 'ozzy', 'oscar@example.com', 'pass15'),
('Paula', 'paula123', 'paula@example.com', 'pass16'),
('Quinn', 'quinnie', 'quinn@example.com', 'pass17'),
('Rita', 'rita_r', 'rita@example.com', 'pass18'),
('Steve', 'steve_rocks', 'steve@example.com', 'pass19'),
('Tina', 'tina_b', 'tina@example.com', 'pass20');


INSERT IGNORE INTO QuestionnaireResponse 
(userID, transportMethod, travelDistance, officeDays, dietDays, meats, heatingHours, turnOffDevices, recycle, reusable, foodWaste) 
VALUES
(1, 3, 4, 6, 3, 2, 8, 3, 3, 3, 2),
(2, 0, 0, 0, 4, 3, 5, 2, 1, 0, 0),
(3, 1, 2, 1, 1, 5, 7, 3, 3, 2, 1),
(4, 4, 1, 7, 5, 4, 9, 3, 3, 3, 2),
(5, 2, 2, 3, 7, 1, 4, 3, 3, 3, 2),
(6, 0, 0, 0, 6, 2, 6, 3, 3, 2, 1),
(7, 3, 5, 2, 5, 3, 9, 3, 3, 3, 2),
(8, 4, 0, 0, 3, 2, 10, 3, 3, 3, 2),
(9, 1, 4, 3, 1, 0, 7, 3, 3, 3, 2),
(10, 2, 1, 6, 6, 4, 8, 3, 3, 3, 2),
(11, 3, 3, 4, 2, 5, 6, 3, 3, 3, 1),
(12, 0, 0, 0, 1, 3, 3, 2, 1, 0, 0),
(13, 1, 5, 5, 5, 4, 11, 3, 3, 3, 2),
(14, 2, 4, 7, 7, 2, 9, 3, 3, 3, 2),
(15, 4, 2, 2, 3, 1, 4, 3, 3, 3, 2),
(16, 0, 0, 0, 4, 2, 6, 3, 3, 2, 1),
(17, 3, 3, 4, 2, 5, 8, 3, 3, 3, 2),
(18, 2, 0, 0, 5, 3, 9, 3, 3, 3, 2),
(19, 4, 5, 6, 6, 4, 7, 3, 3, 3, 2),
(20, 3, 5, 3, 1, 3, 3, 3, 3, 3, 2);

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

INSERT IGNORE INTO EcoCounter (userID, weekID, monthID, activityID, positive_activity, date_done) VALUES
(1, 41, 10, 5, TRUE, '2025-10-14'),
(1, 42, 10, 12, TRUE, '2025-10-22'),
(2, 41, 10, 3, TRUE, '2025-10-16'),
(2, 42, 10, 8, TRUE, '2025-10-23'),
(2, 42, 10, 15, TRUE, '2025-10-25'),
(3, 41, 10, 11, TRUE, '2025-10-18'),
(3, 42, 10, 6, TRUE, '2025-10-24'),
(4, 41, 10, 4, TRUE, '2025-10-17'),
(4, 42, 10, 13, TRUE, '2025-10-21'),
(5, 41, 10, 7, TRUE, '2025-10-13'),
(5, 42, 10, 9, TRUE, '2025-10-26'),
(5, 41, 10, 2, TRUE, '2025-10-19'),
(6, 42, 10, 18, TRUE, '2025-10-25'),
(6, 41, 10, 10, TRUE, '2025-10-15'),
(7, 41, 10, 1, TRUE, '2025-10-16'),
(7, 42, 10, 14, TRUE, '2025-10-20'),
(8, 42, 10, 16, TRUE, '2025-10-24'),
(8, 41, 10, 19, TRUE, '2025-10-17'),
(10, 42, 10, 11, TRUE, '2025-10-26'),
(10, 41, 10, 13, TRUE, '2025-10-18'),
(11, 42, 10, 4, TRUE, '2025-10-25'),
(11, 42, 10, 9, TRUE, '2025-10-23'),
(12, 41, 10, 12, TRUE, '2025-10-14'),
(12, 42, 10, 6, TRUE, '2025-10-22'),
(12, 42, 10, 18, TRUE, '2025-10-26'),
(13, 41, 10, 10, TRUE, '2025-10-13'),
(13, 41, 10, 15, TRUE, '2025-10-19'),
(14, 42, 10, 1, TRUE, '2025-10-25'),
(14, 42, 10, 7, TRUE, '2025-10-21'),
(14, 41, 10, 3, TRUE, '2025-10-18'),
(15, 41, 10, 19, TRUE, '2025-10-15'),
(15, 42, 10, 2, TRUE, '2025-10-24'),
(16, 42, 10, 16, TRUE, '2025-10-22'),
(16, 41, 10, 20, TRUE, '2025-10-17'),
(16, 42, 10, 17, TRUE, '2025-10-20'),
(17, 41, 10, 9, TRUE, '2025-10-18'),
(17, 42, 10, 5, TRUE, '2025-10-23'),
(18, 41, 10, 14, TRUE, '2025-10-16'),
(18, 42, 10, 1, TRUE, '2025-10-21'),
(18, 41, 10, 8, TRUE, '2025-10-14'),
(19, 42, 10, 15, TRUE, '2025-10-25'),
(19, 41, 10, 4, TRUE, '2025-10-19'),
(20, 41, 10, 6, TRUE, '2025-10-13'),
(20, 42, 10, 18, TRUE, '2025-10-22'),
(20, 42, 10, 11, TRUE, '2025-10-26');


INSERT IGNORE INTO EcoCounter (userID, weekID, monthID, activityID, positive_activity, date_done) VALUES
(9, 1, 1, 3, TRUE, '2025-01-08'),
(9, 2, 1, 7, TRUE, '2025-01-17'),
(9, 3, 1, 12, TRUE, '2025-01-22'),
(9, 4, 1, 19, TRUE, '2025-01-29'),
(9, 5, 2, 5, TRUE, '2025-02-07'),
(9, 6, 2, 8, TRUE, '2025-02-15'),
(9, 7, 2, 16, TRUE, '2025-02-21'),
(9, 8, 2, 10, TRUE, '2025-02-27'),
(9, 9, 3, 4, TRUE, '2025-03-05'),
(9, 10, 3, 15, TRUE, '2025-03-13'),
(9, 11, 3, 11, TRUE, '2025-03-21'),
(9, 12, 3, 1, TRUE, '2025-03-27'),
(9, 13, 4, 9, TRUE, '2025-04-04'),
(9, 14, 4, 6, TRUE, '2025-04-09'),
(9, 15, 4, 18, TRUE, '2025-04-18'),
(9, 16, 4, 2, TRUE, '2025-04-25'),
(9, 17, 5, 13, TRUE, '2025-04-29'),
(9, 18, 5, 7, TRUE, '2025-05-09'),
(9, 19, 5, 14, TRUE, '2025-05-13'),
(9, 20, 5, 3, TRUE, '2025-05-23'),
(9, 21, 6, 10, TRUE, '2025-05-30'),
(9, 22, 6, 4, TRUE, '2025-06-06'),
(9, 23, 6, 8, TRUE, '2025-06-13'),
(9, 24, 6, 17, TRUE, '2025-06-20'),
(9, 25, 7, 19, TRUE, '2025-06-27'),
(9, 26, 7, 12, TRUE, '2025-07-02'),
(9, 27, 7, 1, TRUE, '2025-07-10'),
(9, 28, 7, 5, TRUE, '2025-07-18'),
(9, 29, 8, 2, TRUE, '2025-07-22'),
(9, 30, 8, 6, TRUE, '2025-08-02'),
(9, 31, 8, 11, TRUE, '2025-08-05'),
(9, 32, 8, 15, TRUE, '2025-08-12'),
(9, 33, 9, 20, TRUE, '2025-08-20'),
(9, 34, 9, 16, TRUE, '2025-08-28'),
(9, 35, 9, 13, TRUE, '2025-09-04'),
(9, 36, 9, 9, TRUE, '2025-09-13'),
(9, 37, 10, 7, TRUE, '2025-09-18'),
(9, 38, 10, 18, TRUE, '2025-09-25'),
(9, 39, 10, 6, TRUE, '2025-10-03'),
(9, 40, 10, 5, TRUE, '2025-10-09'),
(9, 41, 10, 3, TRUE, '2025-10-16'),
(9, 42, 10, 1, TRUE, '2025-10-25');

INSERT INTO EcoCounter (userID, weekID, monthID, activityID, positive_activity, date_done)
VALUES 
(1, 43, 10, 5, TRUE, '2025-10-29'),
(1, 43, 10, 5, TRUE, '2025-10-28'),
(1, 43, 10, 5, TRUE, '2025-10-28'),
(2, 43, 10, 3, TRUE, '2025-10-28'),
(1, 43, 10, 5, TRUE, '2025-10-29'),
(1, 43, 10, 5, TRUE, '2025-10-29'),
(1, 43, 10, 5, TRUE, '2025-10-29'),
(1, 43, 10, 5, TRUE, '2025-10-29'),
(1, 43, 10, 5, TRUE, '2025-10-29'),
(1, 43, 10, 5, TRUE, '2025-10-29'),
(1, 43, 10, 5, TRUE, '2025-10-29'),
(1, 43, 10, 5, TRUE, '2025-10-29'),
(1, 43, 10, 5, TRUE, '2025-10-29'),
(1, 43, 10, 5, TRUE, '2025-10-29'),
(1, 43, 10, 5, TRUE, '2025-10-29'),
(1, 43, 10, 5, TRUE, '2025-10-29'),
(1, 43, 10, 5, TRUE, '2025-10-29'),
(1, 43, 10, 5, TRUE, '2025-10-29');


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