import unittest
from datetime import datetime
from unittest.mock import patch
from backend.Questionnaire import (
    calculate_transport_emissions,
    calculate_diet_emissions,
    calculate_heating_emissions,
    update_transport_emissions,
    update_diet_emissions,
    update_heating_emissions,
    Questionnaire,
)

class TestQuestionnaire(unittest.TestCase):
    def test_calculate_projected_carbon_footprint(self):
        # Mock answers: keys must match Questionnaire.format_answers expectations
        answers = {
            "transportMethod": 3,  # Car (Petrol/Diesel)
            "travelDistance": 2,   # 10-15 miles
            "officeDays": 3,       # 3 days/week
            "dietDays": 5,         # 5 days/week
            "meats": 0,            # Beef
            "heatingHours": 4      # 4 hours/day
        }

        user_id = "123"
        # Provide a stable start date for deterministic progress calculations
        start_date = datetime(2025, 1, 1)
        q = Questionnaire(answers, user_id, start_date)

        result = q.calculate_projected_carbon_footprint()

        # Result keys are defined in Questionnaire.calculate_projected_carbon_footprint
        # Ensure expected keys exist and values are integers (rounded inside implementation)
        self.assertIn("total_projected", result)
        self.assertIn("projected", result)
        self.assertIn("current", result)

        self.assertIsInstance(result["total_projected"], int)
        self.assertIsInstance(result["projected"], int)
        self.assertIsInstance(result["current"], int)

    def test_helpers_basic(self):
        # Basic smoke tests for helper functions
        assert calculate_transport_emissions(3, 2, 1) >= 0
        assert calculate_diet_emissions(0, 1) > 0
        assert calculate_heating_emissions(2) > 0
        assert update_transport_emissions(3, 2, 4) >= 0
        assert update_diet_emissions(0, 2) > 0
        assert update_heating_emissions(2, 5) > 0

    @patch('backend.Questionnaire.get_user_activity_count_total')
    def test_activity_adjustments_all_branches(self, mock_counts):
        # Return counts that exercise every activity id (1..9)
        mock_counts.return_value = [(i, 1) for i in range(1, 10)]

        answers = {
            "transportMethod": 3,  # Diesel car (to trigger some branches)
            "travelDistance": 2,   # 10-15
            "officeDays": 3,
            "dietDays": 3,
            "meats": 0,
            "heatingHours": 2,
        }
        q = Questionnaire(answers, user_id=1, start_date=datetime(2025, 1, 1))

        # Ensure get_year_progress and set_end_date work
        orig_progress = q.get_year_progress()
        q.set_end_date(datetime(2025, 6, 1))
        assert q.get_year_progress() != orig_progress

        result = q.calculate_projected_carbon_footprint()

        # Validate returned structure and types
        assert isinstance(result, dict)
        for k in ("total_projected", "projected", "current", "transport_emissions", "diet_emissions", "heating_emissions"):
            assert k in result
            assert isinstance(result[k], int)

# if __name__ == "__main__":
#     unittest.main()
