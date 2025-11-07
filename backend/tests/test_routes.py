from unittest import TestCase
from unittest.mock import patch, MagicMock
import io
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

            response = self.app.post('/api/set-questionnaire', json={
                "Q1": "Yes",
                "Q2": "No",
                "Q3": "Sometimes"
            })

            self.assertEqual(response.status_code, 200)
            self.assertIn("Questionnaire submitted successfully", response.get_data(as_text=True))
            mock_insert_questionnaire.assert_called_once_with((1, "Yes", "No", "Sometimes"))

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
        # mock_get_activity_id.side_effect = lambda name: {"Cycling": 101, "Walking": 102}[name]
        mock_get_activity_id.return_value = 101  # Assuming "Cycling" maps to 101
        mock_insert_activity.return_value = None

        with self.app.session_transaction() as sess:
            sess['email'] = "harry@example.com"

        # response = self.app.post('/api/log-activity', json={
        #     "Cycling": 2,
        #     "Walking": 1
        # })

        response = self.app.post('/api/log-activity', json={
            "question": "Cycling",
            "isPositive": True
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn("Activity logged successfully", response.get_data(as_text=True))
        # self.assertEqual(mock_insert_activity.call_count, 3)  # 2 Cycling + 1 Walking
        mock_insert_activity.assert_called_once_with(1, 101, 42, 10, True)

    def test_fetch_questions(self):
        # Mock backend DB call to avoid real DB connection
        with patch('backend.routes.get_all_activity_names', return_value=[]):
            response = self.app.get('/api/fetch-questions')
            self.assertEqual(response.status_code, 200)
            self.assertIsInstance(response.get_json(), list)

    @patch('backend.routes.get_username_from_db')
    @patch('backend.routes.read_view_table_week')
    @patch('backend.routes.read_view_table_month')
    @patch('backend.routes.get_all_questionnaire_submissions')
    @patch('backend.routes.Questionnaire')
    def test_dashboard(self, mock_questionnaire_class, mock_get_submissions, mock_month, mock_week, mock_get_username):
        mock_get_username.return_value = "Harry"
        mock_week.return_value = [{"rank": 1, "username": "Harry", "score": 100}]
        mock_month.return_value = [{"rank": 1, "username": "Harry", "score": 400}]

        # Return a single submission dict: insert user_id first and date last to match routes processing
        from datetime import datetime
        mock_get_submissions.return_value = [
            {"user_id": 1, "Q1": "Yes", "Q2": "No", "Q3": "Sometimes", "date": datetime(2025, 1, 1)}
        ]

        # Mock Questionnaire instance and its projected-carbon return values
        mock_questionnaire_instance = MagicMock()
        mock_questionnaire_instance.calculate_projected_carbon_footprint.return_value = {
            "total_projected": 1200,
            "projected": 1200,
            "current": 300,
            "transport_emissions": 0,
            "diet_emissions": 0,
            "heating_emissions": 0
        }

        mock_questionnaire_class.return_value = mock_questionnaire_instance

        with self.app.session_transaction() as sess:
            sess['email'] = "harry@example.com"

        response = self.app.get('/api/dashboard')
        self.assertEqual(response.status_code, 200)

        data = response.get_json()
        self.assertIn("weekLeaderboard", data)
        self.assertIn("monthLeaderboard", data)
        self.assertIn("username", data)
        # Routes returns totalCarbon/projectedCarbon/currentCarbon keys
        self.assertIn("totalCarbon", data)
        self.assertIn("projectedCarbon", data)
        self.assertIn("currentCarbon", data)

        self.assertEqual(data["username"], "Harry")
        self.assertEqual(data["weekLeaderboard"], [{"rank": 1, "username": "Harry", "score": 100}])
        self.assertEqual(data["monthLeaderboard"], [{"rank": 1, "username": "Harry", "score": 400}])
        self.assertEqual(data["totalCarbon"], 1200)
        self.assertEqual(data["projectedCarbon"], 1200)
        self.assertEqual(data["currentCarbon"], 300)

    def test_fetch_questionnaire_answers_endpoint(self):
        with patch('backend.routes.get_latest_answers_from_questionnaire', return_value={"transportMethod": 1}):
            with self.app.session_transaction() as sess:
                sess['email'] = 'a@b.com'
            resp = self.app.get('/api/fetch-questionnaire-answers')
            assert resp.status_code == 200
            data = resp.get_json()
            assert 'answers' in data

    def test_daily_rank_not_signed_in(self):
        # No session email -> 401
        resp = self.app.get('/api/daily-rank')
        assert resp.status_code == 401

    @patch('backend.routes.allowed_file')
    def test_upload_avatar_invalid(self, mock_allowed):
        mock_allowed.return_value = False
        with self.app.session_transaction() as sess:
            sess['email'] = 'a@b.com'

        data = {'avatar': (io.BytesIO(b'abc'), 'bad.exe')}
        resp = self.app.post('/api/upload-avatar', data=data, content_type='multipart/form-data')
        assert resp.status_code == 400

    @patch('backend.routes.allowed_file')
    @patch('backend.routes.update_user_avatar')
    def test_upload_avatar_success(self, mock_update, mock_allowed):
        mock_allowed.return_value = True
        mock_update.return_value = None
        with self.app.session_transaction() as sess:
            sess['email'] = 'a@b.com'

        data = {'avatar': (io.BytesIO(b'xyz'), 'good.png')}
        resp = self.app.post('/api/upload-avatar', data=data, content_type='multipart/form-data')
        # Should either succeed with 200 or 400 depending on filesystem permissions; assert 200
        assert resp.status_code == 200

# if __name__ == '__main__':
#     unittest.main()