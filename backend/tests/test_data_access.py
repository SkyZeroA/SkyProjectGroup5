from unittest import TestCase
from unittest.mock import patch, MagicMock
from datetime import date, datetime
import os
from backend.data_access import (init_db, init_insert,insert_new_user, get_user_id_from_db, get_username_from_db,
                                 check_password, insert_into_questionnaire, read_user_table,
                                 read_view_table_week, read_view_table_month, get_current_week_number, get_current_month_number,
                                 get_users_preferred_activities, get_activity_id, get_all_activity_names, insert_user_activity)


from backend.data_access import (
    get_db_connect_kwargs,
    get_latest_answers_from_questionnaire,
    get_all_questionnaire_submissions,
    get_user_daily_ranks,
)

# Sample test data
TEST_EMAIL = "harry@example.com"
TEST_FIRST_NAME = "Harry"
TEST_USERNAME = "harrySky"
TEST_PASSWORD = "test123"

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
        self.mock_cursor.fetchall.return_value = [("Recycling",), ("Walking",)]
        result = get_users_preferred_activities(1)
        self.assertEqual(result, ["Recycling", "Walking"])

    # Ensure all activity names are fetched.
    def test_get_all_activity_names(self):
        self.mock_cursor.fetchall.return_value = [("Cycling",), ("Composting",)]
        result = get_all_activity_names()
        self.assertEqual(result, ["Cycling", "Composting"])


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
        # No DB_PORT -> omitted
        with patch.dict(os.environ, {}, clear=False):
            kwargs = get_db_connect_kwargs()
            assert 'port' not in kwargs

        # With numeric DB_PORT -> integer
        with patch.dict(os.environ, {'DB_PORT': '3306'}, clear=False):
            kwargs = get_db_connect_kwargs()
            assert isinstance(kwargs.get('port'), int)

        # With non-numeric DB_PORT -> kept as string
        with patch.dict(os.environ, {'DB_PORT': 'notint'}, clear=False):
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
            res = get_latest_answers_from_questionnaire('noone@example.com')
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
            (1, 2, 3, 4, 5, 6, row_date),
        ]
        # ensure get_user_id_from_db will be called inside function; patch it to return 42
        with patch('backend.data_access.get_user_id_from_db', return_value=42):
            subs = get_all_questionnaire_submissions('user@example.com')
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

# if __name__ == '__main__':
#     unittest.main()