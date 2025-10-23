from unittest import TestCase
from unittest.mock import patch, MagicMock

from flask import session
from backend import app

class TestFlaskAPI(TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    # Test for Successful Sign-Up (200 OK)
    @patch('backend.routes.read_user_table')
    @patch('backend.routes.insert_new_user')
    def test_sign_up_success(self, mock_insert_new_user, mock_read_user_table):
        # with self.app.session_transaction() as sess:
        #     sess.clear()

        mock_read_user_table.return_value = ([], [])
        mock_insert_new_user.return_value = None

        response = self.app.post('/api/sign-up', json={
            "email": "harry@example.com",
            "first-name": "harry",
            "username": "harrySky",
            "password": "test123",
            "confirm-password": "test123"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("Sign up successful", response.get_data(as_text=True))

    # Test for Username Already Exists (401)
    @patch('backend.routes.read_user_table')
    def test_sign_up_username_exists(self, mock_read_user_table):
        mock_read_user_table.return_value = (["harrySky"], [])

        response = self.app.post('/api/sign-up', json={
            "email": "harry@example.com",
            "first-name": "harry",
            "username": "harrySky",
            "password": "test123",
            "confirm-password": "test123"
        })

        self.assertEqual(response.status_code, 401)
        self.assertIn("Username already exists", response.get_data(as_text=True))


    # Test for Password Mismatch (401)
    @patch('backend.routes.read_user_table')
    def test_sign_up_password_mismatch(self, mock_read_user_table):
        mock_read_user_table.return_value = ([], [])
        response = self.app.post('/api/sign-up', json={
            "email": "user@example.com",
            "first-name": "User",
            "username": "user123",
            "password": "pass1",
            "confirm-password": "pass2"
        })
        self.assertEqual(response.status_code, 401)
        self.assertIn("Passwords do not match", response.get_data(as_text=True))

    # Test for Sign in Password Correct (200)
    @patch('backend.routes.check_password')
    def test_sign_in_success(self, mock_check_password):
        mock_check_password.return_value = True
        response = self.app.post('/api/sign-in', json={
            "email": "harry@example.com",
            "password": "test123"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("Sign in successful", response.get_data(as_text=True))

    # Test for Sign in Password Incorrect (401)
    @patch('backend.routes.check_password')
    def test_sign_in_failure(self,mock_check_password):
        mock_check_password.return_value = False
        response = self.app.post('/api/sign-in', json={
            "email": "harry@example.com",
            "password": "wrongpass"
        })
        self.assertEqual(response.status_code, 401)
        self.assertIn("Incorrect username or password", response.get_data(as_text=True))



    # def test_questionnaire_submission(self):
    #     with self.app.session_transaction() as sess:
    #         sess['email'] = "harry@example.com"
    #
    #     response = self.app.post('/api/questionnaire', json={
    #         "Q1": "Yes",
    #         "Q2": "No",
    #         "Q3": "Sometimes"
    #     })
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn("Questionnaire submitted successfully", response.get_data(as_text=True))

    # Mock the function that inserts questionnaire data into the database
    @patch('backend.routes.insert_into_questionnaire')
    @patch('backend.routes.get_user_id_from_db')
    @patch('backend.routes.Questionnaire')
    def test_questionnaire_submission(self, mock_questionnaire_class, mock_get_user_id, mock_insert_questionnaire):

            mock_get_user_id.return_value = 1
            # Create a mock Questionnaire instance
            mock_questionnaire_instance = MagicMock()
            mock_questionnaire_instance.format_answers.return_value = (1, "Yes", "No", "Sometimes")
            mock_questionnaire_class.return_value = mock_questionnaire_instance

            with self.app.session_transaction() as sess:
                sess['email'] = "harry@example.com"

            response = self.app.post('/api/questionnaire', json={
                "Q1": "Yes",
                "Q2": "No",
                "Q3": "Sometimes"
            })

            self.assertEqual(response.status_code, 200)
            self.assertIn("Questionnaire submitted successfully", response.get_data(as_text=True))
            mock_insert_questionnaire.assert_called_once_with((1, "Yes", "No", "Sometimes"))

    # def test_user_activities(self):
    #     with self.app.session_transaction() as sess:
    #         sess['email'] = "harry@example.com"
    #
    #     response = self.app.get('/api/user-activities')
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIsInstance(response.get_json(), list)

    # Mock the functions used in the /api/user-activities route
    @patch('backend.routes.get_users_preferred_activities')
    @patch('backend.routes.get_user_id_from_db')
    def test_user_activities(self, mock_get_user_id, mock_get_activities):
        mock_get_user_id.return_value = 1
        mock_get_activities.return_value = ["Recycling", "Walking"]

        with self.app.session_transaction() as sess:
            sess['email'] = "harry@example.com"

        response = self.app.get('/api/user-activities')

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.get_json(), list)
        self.assertEqual(response.get_json(), ["Recycling", "Walking"])

    # def test_log_activity(self):
    #     with self.app.session_transaction() as sess:
    #         sess['email'] = "harry@example.com"
    #
    #     response = self.app.post('/api/log-activity', json={
    #         "Cycling": 2,
    #         "Walking": 1
    #     })
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn("Activity logged successfully", response.get_data(as_text=True))

    from unittest import TestCase
    from unittest.mock import patch
    from backend import app


    @patch('backend.routes.insert_user_activity')
    @patch('backend.routes.get_activity_id')
    @patch('backend.routes.get_current_month_number')
    @patch('backend.routes.get_current_week_number')
    @patch('backend.routes.get_user_id_from_db')
    def test_log_activity(self, mock_get_user_id, mock_get_week, mock_get_month, mock_get_activity_id,
                                  mock_insert_activity):
        mock_get_user_id.return_value = 1
        mock_get_week.return_value = 42
        mock_get_month.return_value = 10
        mock_get_activity_id.side_effect = lambda name: {"Cycling": 101, "Walking": 102}[name]
        mock_insert_activity.return_value = None

        with self.app.session_transaction() as sess:
            sess['email'] = "harry@example.com"

        response = self.app.post('/api/log-activity', json={
            "Cycling": 2,
            "Walking": 1
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn("Activity logged successfully", response.get_data(as_text=True))
        self.assertEqual(mock_insert_activity.call_count, 3)  # 2 Cycling + 1 Walking

    def test_fetch_questions(self):
        response = self.app.get('/api/fetch-questions')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.get_json(), list)

    def test_dashboard(self):
        with self.app.session_transaction() as sess:
            sess['email'] = "harry@example.com"

        response = self.app.get('/api/dashboard')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("weekLeaderboard", data)
        self.assertIn("monthLeaderboard", data)
        self.assertIn("username", data)


# if __name__ == '__main__':
#     unittest.main()