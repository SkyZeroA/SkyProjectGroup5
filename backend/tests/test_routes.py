from unittest import TestCase
from unittest.mock import patch, MagicMock
import io
from flask import session
from backend import app

class TestFlaskAPI(TestCase):

    def setUp(self):
        app.config['SECRET_KEY'] = 'test-secret'
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        self.app = app.test_client(use_cookies=True)



    # Test for Successful Sign-Up (200 OK)
    @patch('backend.routes.read_user_table')
    @patch('backend.routes.insert_new_user')
    def test_sign_up_success(self, mock_insert_new_user, mock_read_user_table):
        # with self.app.session_transaction() as sess:
        #     sess.clear()

        mock_read_user_table.return_value = ([], [])
        mock_insert_new_user.return_value = None

        response = self.app.post('/api/sign-up', json={
            "email": "harry@sky.uk",
            "first-name": "harry",
            "username": "harrySky",
            "password": "Password1!",
            "confirm-password": "Password1!"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("Sign up successful", response.get_data(as_text=True))

    # Test for Username Already Exists (401)
    @patch('backend.routes.read_user_table')
    def test_sign_up_username_exists(self, mock_read_user_table):
        mock_read_user_table.return_value = (["harrySky"], [])

        response = self.app.post('/api/sign-up', json={
            "email": "harry@sky.uk",
            "first-name": "harry",
            "username": "harrySky",
            "password": "Password1!",
            "confirm-password": "Password1!"
        })

        self.assertEqual(response.status_code, 401)
        self.assertIn("Username already exists", response.get_data(as_text=True))


    # Test for Password Mismatch (401)
    @patch('backend.routes.read_user_table')
    def test_sign_up_password_mismatch(self, mock_read_user_table):
        mock_read_user_table.return_value = ([], [])
        response = self.app.post('/api/sign-up', json={
            "email": "user@sky.uk",
            "first-name": "User",
            "username": "user123",
            "password": "Password1!",
            "confirm-password": "Password2!"
        })
        self.assertEqual(response.status_code, 401)
        self.assertIn("Passwords do not match", response.get_data(as_text=True))

    # Test for Sign in Password Correct (200)
    @patch('backend.routes.check_password')
    def test_sign_in_success(self, mock_check_password):
        mock_check_password.return_value = True
        response = self.app.post('/api/sign-in', json={
            "email": "harry@sky.uk",
            "password": "Password1!"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("Sign in successful", response.get_data(as_text=True))

    # Test for Sign in Password Incorrect (401)
    @patch('backend.routes.check_password')
    def test_sign_in_failure(self,mock_check_password):
        mock_check_password.return_value = False
        response = self.app.post('/api/sign-in', json={
            "email": "harry@sky.uk",
            "password": "Password11111!"
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
    @patch('backend.routes.g', new_callable=MagicMock)
    def test_log_activity(self, mock_g, mock_get_user_id, mock_get_week, mock_get_month, mock_get_activity_id, mock_insert_activity):
        mock_g.user_id = 1
        mock_get_user_id.return_value = 1
        mock_get_week.return_value = 42
        mock_get_month.return_value = 10
        mock_get_activity_id.return_value = 101
        mock_insert_activity.return_value = None

        with self.app.session_transaction() as sess:
            sess['email'] = "harry@sky.uk"

        response = self.app.post('/api/log-activity', json={
            "question": "Cycling",
            "isPositive": True
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn("Activity logged successfully", response.get_data(as_text=True))
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

    def test_csrf_token_endpoint(self):
        # csrf token endpoint should return a token
        resp = self.app.get('/api/csrf-token')
        assert resp.status_code == 200
        data = resp.get_json()
        assert 'csrf_token' in data

    @patch('backend.routes.g', new_callable=MagicMock)
    @patch('backend.routes.update_user_preferred_activities')
    @patch('backend.routes.get_user_id_from_db')
    def test_update_user_activities(self, mock_get_user_id, mock_update_prefs, mock_g):
        mock_g.user_id = 1
        mock_get_user_id.return_value = 1
        with self.app.session_transaction() as sess:
            sess['email'] = 'a@b.com'

        resp = self.app.post('/api/update-user-activities', json={'activities': ['Walking', 'Recycling']})
        self.assertEqual(resp.status_code, 200)
        mock_update_prefs.assert_called_once_with(1, ['Walking', 'Recycling'])

    @patch('backend.routes.get_users_preferred_activities_no_points')
    @patch('backend.routes.get_activity_id')
    @patch('backend.routes.get_user_activity_count')
    def test_user_activity_counts(self, mock_count, mock_get_id, mock_get_activities):
        mock_get_activities.return_value = ['Recycling']
        mock_get_id.return_value = 7
        mock_count.return_value = 3

        with self.app.session_transaction() as sess:
            sess['email'] = 'a@b.com'

        resp = self.app.get('/api/user-activity-counts')
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertEqual(data, {'Recycling': 3})

    @patch('backend.routes.get_tips_from_db')
    def test_initial_ai_tips_loaded_from_buffer(self, mock_get_tips):
        # If buffer has >= DISPLAY_COUNT, endpoint should return last DISPLAY_COUNT
        mock_get_tips.return_value = ['t1', 't2', 't3', 't4']
        with self.app.session_transaction() as sess:
            sess['email'] = 'a@b.com'

        resp = self.app.get('/api/initial-ai-tips')
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertIn('tips', data)
        self.assertEqual(data['tips'], ['t2', 't3', 't4'])

    @patch('backend.routes.get_tips_from_db')
    @patch('backend.routes.generate_tip')
    @patch('backend.routes.set_tips_in_db')
    def test_initial_ai_tips_generated(self, mock_set_tips, mock_generate, mock_get_tips):
        mock_get_tips.return_value = []
        mock_generate.return_value = 'generated'
        with self.app.session_transaction() as sess:
            sess['email'] = 'a@b.com'

        resp = self.app.get('/api/initial-ai-tips')
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertEqual(data['message'], 'Tips generated')
        self.assertEqual(len(data['tips']), 3)

    @patch('backend.routes.get_tips_from_db')
    @patch('backend.routes.generate_tip')
    @patch('backend.routes.set_tips_in_db')
    def test_ai_tip_generates_and_saves(self, mock_set_tips, mock_generate, mock_get_tips):
        mock_get_tips.return_value = ['existing']
        mock_generate.return_value = 'new_tip'
        with self.app.session_transaction() as sess:
            sess['email'] = 'a@b.com'

        resp = self.app.get('/api/ai-tip')
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertEqual(data.get('tip'), 'new_tip')
        mock_set_tips.assert_called()

    @patch('backend.routes.get_user_id_from_db')
    @patch('backend.routes.get_username_from_db')
    @patch('backend.routes.read_view_table_week')
    @patch('backend.routes.read_view_table_month')
    @patch('backend.routes.get_all_questionnaire_submissions')
    @patch('backend.routes.Questionnaire')
    @patch('backend.routes.get_highest_week_points')
    @patch('backend.routes.get_highest_month_points')
    @patch('backend.routes.get_user_highest_week_points')
    @patch('backend.routes.get_user_highest_month_points')
    def test_stats(self, mock_user_high_month, mock_user_high_week, mock_high_month, mock_high_week, mock_questionnaire_class, mock_get_submissions, mock_read_month, mock_read_week, mock_get_username, mock_get_user_id):
        mock_get_user_id.return_value = 1
        mock_get_username.return_value = 'Harry'
        mock_read_week.return_value = [{'rank':1,'username':'Harry','score':100}]
        mock_read_month.return_value = [{'rank':1,'username':'Harry','score':400}]

        from datetime import datetime
        mock_get_submissions.return_value = [
            {'user_id':1, 'Q1':'Yes', 'date': datetime(2025,1,1)}
        ]

        mock_questionnaire_instance = MagicMock()
        mock_questionnaire_instance.calculate_projected_carbon_footprint.return_value = {
            'total_projected': 1200,
            'projected': 1200,
            'current': 300,
            'transport_emissions': 0,
            'diet_emissions': 0,
            'heating_emissions': 0
        }
        mock_questionnaire_class.return_value = mock_questionnaire_instance
        mock_high_week.return_value = {'username':'Harry','points':100}
        mock_high_month.return_value = {'username':'Harry','points':400}
        mock_user_high_week.return_value = 10
        mock_user_high_month.return_value = 20

        with self.app.session_transaction() as sess:
            sess['email'] = 'harry@example.com'

        resp = self.app.get('/api/stats')
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertIn('weekLeaderboard', data)
        self.assertIn('monthLeaderboard', data)
        self.assertIn('username', data)

    @patch('backend.routes.get_username_from_db')
    @patch('backend.routes.get_first_name_from_db')
    @patch('backend.routes.get_avatar_from_db')
    def test_fetch_user_data(self, mock_avatar, mock_first, mock_user):
        mock_user.return_value = 'harry'
        mock_first.return_value = 'Harry'
        mock_avatar.return_value = 'avatar.png'
        with self.app.session_transaction() as sess:
            sess['email'] = 'harry@example.com'

        resp = self.app.get('/api/fetch-user-data')
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertEqual(data.get('avatar'), '/uploads/avatar.png')

    @patch('backend.routes.get_daily_activity_counts')
    def test_calendar_activity_counts(self, mock_counts):
        mock_counts.return_value = {'2025-01-01': 2}
        with self.app.session_transaction() as sess:
            sess['email'] = 'harry@example.com'

        resp = self.app.get('/api/calendar-activity-counts?startDate=2025-01-01&endDate=2025-01-31')
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertIn('counts', data)

    @patch('backend.routes.get_user_week_points')
    @patch('backend.routes.get_user_month_points')
    def test_user_points(self, mock_month_points, mock_week_points):
        mock_week_points.return_value = {'points': 5}
        mock_month_points.return_value = {'points': 20}
        with self.app.session_transaction() as sess:
            sess['email'] = 'harry@example.com'

        resp_week = self.app.get('/api/user-points?period=week&year=2025&weekChunk=0')
        self.assertEqual(resp_week.status_code, 200)
        self.assertEqual(resp_week.get_json(), {'points': 5})

        resp_month = self.app.get('/api/user-points?period=month&year=2025&monthChunk=0')
        self.assertEqual(resp_month.status_code, 200)
        self.assertEqual(resp_month.get_json(), {'points': 20})

# if __name__ == '__main__':
#     unittest.main()