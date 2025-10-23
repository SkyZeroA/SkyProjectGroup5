import unittest
from datetime import datetime# Adjust import if needed
from backend.Questionnaire import Questionnaire

class TestQuestionnaire(unittest.TestCase):
    def test_calculate_projected_carbon_footprint(self):
        # Mock answers: transport=2 (Car Petrol/Diesel), diet=1 (Mixed), efficiency=0 (Very efficient)
        answers = {
            "transport": 2,
            "diet": 1,
            "efficiency": 0
        }
        user_id = "123"
        q = Questionnaire(answers, user_id)

        result = q.calculate_projected_carbon_footprint()

        # Expected annual total: 2.4 (transport) + 1.7 (diet) + 0.8 (efficiency) = 4.9
        expected_total = 4.9

        # Calculate expected year progress
        today = datetime.today()
        day_of_year = today.timetuple().tm_yday
        is_leap = (today.year % 4 == 0 and (today.year % 100 != 0 or today.year % 400 == 0))
        days_in_year = 366 if is_leap else 365
        year_progress = day_of_year / days_in_year
        expected_current = round(expected_total * year_progress, 2)

        self.assertAlmostEqual(result["annual_total"], expected_total)
        self.assertAlmostEqual(result["current_to_date"], expected_current)
        self.assertAlmostEqual(result["year_progress_percent"], round(year_progress * 100, 2))

# if __name__ == "__main__":
#     unittest.main()
