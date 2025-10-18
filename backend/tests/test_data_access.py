from unittest import TestCase
from unittest.mock import patch, MagicMock
from datetime import date
from backend.data_access import (insert_new_user, get_user_id_from_db, get_username_from_db,
                                 check_password, insert_into_questionnaire, read_user_table,
                                 read_view_table_week, read_view_table_month, get_current_week_number, get_current_month_number,
                                 get_users_preferred_activities, get_activity_id, get_all_activity_names, insert_user_activity)

# Sample test data
TEST_EMAIL = "harry@example.com"
TEST_FIRST_NAME = "Harry"
TEST_USERNAME = "harrySky"
TEST_PASSWORD = "test123"

class TestDatabaseFunctions(TestCase):

    def setUp(self):

        self.data_access = MagicMock()
        self.sample_data = [
            {"id": 1, "name": "Alice"},
            {"id": 2, "name": "Bob"},
            {"id": 3, "name": "Charlie"},
        ]
        self.data_access.get_all.return_value = self.sample_data
        self.data_access.get_by_id.side_effect = lambda x: next((item for item in self.sample_data if item["id"] == x), None)
        self.data_access.create.side_effect = lambda x: {"id": len(self.sample_data) + 1, **x}
        self.data_access.update.side_effect = lambda id, x: {**x, "id": id} if any(item["id"] == id for item in self.sample_data) else None
        self.data_access.delete.side_effect = lambda id: True if any(item["id"] == id for item in self.sample_data) else False

        patcher = patch('mysql.connector.connect')
        self.addCleanup(patcher.stop)
        self.mock_connect = patcher.start()

        self.mock_conn = MagicMock()
        self.mock_cursor = MagicMock()
        self.mock_connect.return_value = self.mock_conn
        self.mock_conn.cursor.return_value = self.mock_cursor

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
        self.mock_cursor.fetchall.return_value = [("user1", 10), ("user2", 20)]
        result = read_view_table_week()
        self.assertEqual(result, [{"name": "user1", "score": 10}, {"name": "user2", "score": 20}])

    # Validate leaderboard data format (Month).
    def test_read_view_table_month(self):
        self.mock_cursor.fetchall.return_value = [("user1", 30), ("user2", 40)]
        result = read_view_table_month()
        self.assertEqual(result, [{"name": "user1", "score": 30}, {"name": "user2", "score": 40}])

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
        insert_user_activity(1, 2, 3, 4)
        self.mock_cursor.execute.assert_called_once()
        self.mock_conn.commit.assert_called_once()

# if __name__ == '__main__':
#     unittest.main()