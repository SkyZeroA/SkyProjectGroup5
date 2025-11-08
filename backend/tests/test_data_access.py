from unittest import TestCase
from unittest.mock import patch, MagicMock
from datetime import date, datetime
import os
import json
from backend.data_access import (init_db, init_insert,insert_new_user, get_user_id_from_db, get_username_from_db,
                                 check_password, insert_into_questionnaire, read_user_table,
                                 read_view_table_week, read_view_table_month, get_current_week_number, get_current_month_number,
                                 get_users_preferred_activities, get_activity_id, get_all_activity_names, insert_user_activity
                                 ,get_tips_from_db, set_tips_in_db, update_user_preferred_activities, get_avatar_from_db, update_user_avatar,
                                 get_user_activity_count, get_user_activity_count_total, get_daily_activity_counts)


from backend.data_access import (
    get_db_connect_kwargs,
    get_latest_answers_from_questionnaire,
    get_all_questionnaire_submissions,
    get_user_daily_ranks,
)

# Sample test data
TEST_EMAIL = "harry@sky.uk"
TEST_FIRST_NAME = "Harry"
TEST_USERNAME = "harrySky"
TEST_PASSWORD = "Password1!"

class TestDatabaseFunctions(TestCase):

    def setUp(self):
        patcher = patch('mysql.connector.connect')
        self.addCleanup(patcher.stop)
        self.mock_connect = patcher.start()

        self.mock_conn = MagicMock()
        self.mock_cursor = MagicMock()
        self.mock_connect.return_value = self.mock_conn
        self.mock_conn.cursor.return_value = self.mock_cursor

    # Test for read create database file
    @patch("backend.data_access.Path.read_text",
           return_value="CREATE DATABASE test; USE test; CREATE TABLE User(id INT);")
    @patch("backend.data_access.Path.exists", return_value=True)
    def test_init_db(self, mock_exists, mock_read_text):

        init_db()
        self.mock_cursor.execute.assert_any_call("CREATE DATABASE test")
        self.mock_cursor.execute.assert_any_call("USE test")
        self.mock_cursor.execute.assert_any_call("CREATE TABLE User(id INT)")
        self.mock_conn.commit.assert_called_once()

    # Test for read insert table file
    @patch("backend.data_access.Path.read_text", return_value="CREATE VIEW test_view AS SELECT * FROM User;")
    @patch("backend.data_access.Path.exists", return_value=True)
    def test_init_insert(self, mock_exists, mock_read_text):
        init_insert()
        self.mock_cursor.execute.assert_called_with("CREATE VIEW test_view AS SELECT * FROM User")
        self.mock_conn.commit.assert_called_once()

    #  Test for Missing File Error
    @patch("backend.data_access.Path.exists", return_value=False)
    def test_init_db_file_not_found(self, mock_exists):
        with self.assertRaises(FileNotFoundError):
            init_db()

    #  Test for Missing File Error
    @patch("backend.data_access.Path.exists", return_value=False)
    def test_init_insert_file_not_found(self, mock_exists):
        with self.assertRaises(FileNotFoundError):
            init_insert()

    # Insert a user and verify it's in the DB.
    def test_insert_new_user(self):
        insert_new_user(TEST_EMAIL, TEST_FIRST_NAME, TEST_USERNAME, TEST_PASSWORD)
        self.mock_cursor.execute.assert_called_once()
        self.mock_conn.commit.assert_called_once()

    # Retrieve user ID by email.
    def test_get_user_id_from_db(self):
        self.mock_cursor.fetchone.return_value = [123]
        user_id = get_user_id_from_db(TEST_EMAIL)
        self.assertEqual(user_id, 123)

    #  Retrieve username by email.
    def test_get_username_from_db(self):
        self.mock_cursor.fetchone.return_value = [TEST_USERNAME]
        username = get_username_from_db(TEST_EMAIL)
        self.assertEqual(username, TEST_USERNAME)

    # Verify correct and incorrect password hashes.
    def test_check_password_correct(self):
        self.mock_cursor.fetchone.return_value = [TEST_PASSWORD]
        result = check_password(TEST_EMAIL, TEST_PASSWORD)
        self.assertTrue(result)

    def test_check_password_incorrect(self):
        self.mock_cursor.fetchone.return_value = ["wrong_hash"]
        result = check_password(TEST_EMAIL, TEST_PASSWORD)
        self.assertFalse(result)

    # Insert a questionnaire response and verify.
    def test_insert_into_questionnaire(self):
        insert_into_questionnaire((1, "Q1", "Q2", "Q3"))
        self.mock_cursor.execute.assert_called_once()
        self.mock_conn.commit.assert_called_once()

    # Check if usernames and emails are returned correctly.
    def test_read_user_table(self):
        self.mock_cursor.fetchall.return_value = [("user1", "email1"), ("user2", "email2")]
        users, emails = read_user_table()
        self.assertEqual(users, ["user1", "user2"])
        self.assertEqual(emails, ["email1", "email2"])

    # Validate leaderboard data format (Week).
    def test_read_view_table_week(self):
        # Each row should be (username, avatarFilename, totalPoints)
        self.mock_cursor.fetchall.return_value = [("user1", "avatar1.png", 10), ("user2", "avatar2.png", 20)]
        result = read_view_table_week()
        self.assertEqual(result, [{"name": "user1", "avatarFilename": "avatar1.png", "score": 10}, {"name": "user2", "avatarFilename": "avatar2.png", "score": 20}])

    # Validate leaderboard data format (Month).
    def test_read_view_table_month(self):
        # Each row should be (username, avatarFilename, totalPoints)
        self.mock_cursor.fetchall.return_value = [("user1", "avatar1.png", 30), ("user2", "avatar2.png", 40)]
        result = read_view_table_month()
        self.assertEqual(result, [{"name": "user1", "avatarFilename": "avatar1.png", "score": 30}, {"name": "user2", "avatarFilename": "avatar2.png", "score": 40}])

    # Ensure correct week ID is returned.
    def test_get_current_week_number(self):
        self.mock_cursor.fetchone.return_value = [42]
        result = get_current_week_number()
        self.assertEqual(result, 42)

    # Ensure correct month ID is returned.
    def test_get_current_month_number(self):
        self.mock_cursor.fetchone.return_value = [10]
        result = get_current_month_number()
        self.assertEqual(result, 10)

    # Validate activity names returned for a user.
    def test_get_users_preferred_activities(self):
        # Each row should be (activity_name, value_points)
        self.mock_cursor.fetchall.return_value = [("Recycling", 5), ("Walking", 3)]
        result = get_users_preferred_activities(1)
        self.assertEqual(result, [{"name": "Recycling", "points": 5}, {"name": "Walking", "points": 3}])

    # Ensure all activity names are fetched.
    def test_get_all_activity_names(self):
        # ActivityKey returns (activity_name, value_points)
        self.mock_cursor.fetchall.return_value = [("Cycling", 10), ("Composting", 2)]
        result = get_all_activity_names()
        self.assertEqual(result, [{"name": "Cycling", "points": 10}, {"name": "Composting", "points": 2}])


    # Validate correct activity ID is returned.
    def test_get_activity_id(self):
        self.mock_cursor.fetchone.return_value = [5]
        result = get_activity_id("Cycling")
        self.assertEqual(result, 5)

    # Insert an activity and verify it's stored.
    def test_insert_user_activity(self):
        insert_user_activity(1, 2, 3, 4, True)
        self.mock_cursor.execute.assert_called_once()
        self.mock_conn.commit.assert_called_once()

# ===================================

    def test_get_db_connect_kwargs_port_handling(self):
        # Use clear=True to ensure environment is deterministic for the test
        # No DB_PORT -> omitted
        with patch.dict(os.environ, {}, clear=True):
            kwargs = get_db_connect_kwargs()
            assert 'port' not in kwargs

        # With numeric DB_PORT -> integer
        with patch.dict(os.environ, {'DB_PORT': '3306'}, clear=True):
            kwargs = get_db_connect_kwargs()
            assert isinstance(kwargs.get('port'), int)

        # With non-numeric DB_PORT -> kept as string
        with patch.dict(os.environ, {'DB_PORT': 'notint'}, clear=True):
            kwargs = get_db_connect_kwargs()
            assert kwargs.get('port') == 'notint'

    @patch('mysql.connector.connect')
    def test_get_latest_answers_none(self, mock_connect):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        # Simulate no answers
        mock_cursor.fetchone.return_value = None
        # Patch get_user_id_from_db so that the function uses a valid id
        with patch('backend.data_access.get_user_id_from_db', return_value=1):
            res = get_latest_answers_from_questionnaire(1)
            assert res == []

    @patch('mysql.connector.connect')
    def test_get_all_questionnaire_submissions_conversion(self, mock_connect):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        # Simulate two rows returned by the DB
        row_date = datetime(2025, 1, 1)
        mock_cursor.fetchall.return_value = [
            (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, row_date),
        ]
        # ensure get_user_id_from_db will be called inside function; patch it to return 42
        with patch('backend.data_access.get_user_id_from_db', return_value=42):
            subs = get_all_questionnaire_submissions(42)
            assert isinstance(subs, list)
            assert subs[0]['userId'] == 42
            assert subs[0]['dateSubmitted'] == row_date

    @patch('mysql.connector.connect')
    def test_get_user_daily_ranks_basic(self, mock_connect):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        # Make cursor behave as dictionary=True is passed
        mock_conn.cursor.return_value = mock_cursor

        # Simulate daily_scores: two users over two days
        d1 = date(2025, 1, 1)
        d2 = date(2025, 1, 2)
        mock_cursor.fetchall.return_value = [
            {"user_id": 1, "date": d1, "total_score": 10},
            {"user_id": 2, "date": d1, "total_score": 5},
            {"user_id": 1, "date": d2, "total_score": 0},
            {"user_id": 2, "date": d2, "total_score": 7},
        ]

        ranks = get_user_daily_ranks(1, period="week", start_date="2025-01-01", end_date="2025-01-02")
        # Expect ranks list for two days
        assert len(ranks) == 2
        assert ranks[0]['date'] == d1.isoformat()
        # user 1 should be rank 1 on first day
        assert ranks[0]['rank'] == 1

    
    def test_get_tips_from_db_with_data(self):
        # Simulate DB returning JSON string
        self.mock_cursor.fetchone.return_value = [json.dumps(['a', 'b', 'c'])]
        result = get_tips_from_db(1)
        self.assertEqual(result, ['a', 'b', 'c'])

    def test_get_tips_from_db_none(self):
        self.mock_cursor.fetchone.return_value = [None]
        result = get_tips_from_db(1)
        self.assertIsNone(result)

    def test_set_tips_in_db_calls_execute_and_commit(self):
        set_tips_in_db(1, ['x', 'y'])
        # Should call execute then commit
        self.mock_cursor.execute.assert_called()
        self.mock_conn.commit.assert_called_once()

    def test_get_avatar_from_db(self):
        self.mock_cursor.fetchone.return_value = ['avatar.png']
        result = get_avatar_from_db(1)
        self.assertEqual(result, 'avatar.png')

    def test_update_user_avatar_executes(self):
        update_user_avatar(1, 'new.png')
        self.mock_cursor.execute.assert_called_once()
        self.mock_conn.commit.assert_called_once()

    def test_get_user_activity_count(self):
        # Simulate fetchone returning a single int value
        self.mock_cursor.fetchone.return_value = [7]
        result = get_user_activity_count(1, 2)
        self.assertEqual(result, 7)

    def test_get_user_activity_count_total(self):
        # Simulate two rows returned
        self.mock_cursor.fetchall.return_value = [(10, 5), (20, 3)]
        result = get_user_activity_count_total(1)
        # Expect list of tuples with ints
        self.assertIsInstance(result, list)
        self.assertEqual(result[0][0], 10)

    def test_update_user_preferred_activities(self):
        # Patch get_activity_id to avoid DB lookup inside function
        with patch('backend.data_access.get_activity_id', side_effect=[101, 102]):
            update_user_preferred_activities(1, ['A', 'B'])
        # Expect delete + two inserts
        # First call is DELETE
        self.mock_cursor.execute.assert_any_call("DELETE FROM UserActivity WHERE userID = %s", (1,))
        # Then INSERTs
        self.assertTrue(any("INSERT INTO UserActivity" in str(call) for call in self.mock_cursor.execute.call_args_list))
        self.mock_conn.commit.assert_called_once()

    def test_get_daily_activity_counts(self):
        # Simulate DB rows returned as dicts with date objects
        d = date(2025, 1, 1)
        self.mock_cursor.fetchall.return_value = [
            {"activity_date": d, "daily_count": 2}
        ]
        result = get_daily_activity_counts(1, start_date="2025-01-01", end_date="2025-01-01")
        self.assertEqual(result, {"2025-01-01": 2})

    def test_get_user_id_from_db_not_found(self):
        self.mock_cursor.fetchone.return_value = None
        result = get_user_id_from_db(TEST_EMAIL)
        self.assertIsNone(result)

    def test_get_username_from_db_not_found(self):
        self.mock_cursor.fetchone.return_value = None
        result = get_username_from_db(TEST_EMAIL)
        self.assertIsNone(result)

    def test_get_user_daily_ranks_ties(self):
        d = date(2025, 1, 1)
        self.mock_cursor.fetchall.return_value = [
            {"user_id": 1, "date": d, "total_score": 10},
            {"user_id": 2, "date": d, "total_score": 10},  # Tie
            {"user_id": 3, "date": d, "total_score": 5},
        ]
        ranks = get_user_daily_ranks(1, period="week", start_date="2025-01-01", end_date="2025-01-01")
        self.assertEqual(len(ranks), 1)
        # Rank 1 should be for user 1 and user 2 (tie)
        self.assertEqual(ranks[0]['rank'], 1)


# if __name__ == '__main__':
#     unittest.main()