import unittest
from datetime import datetime
from unittest.mock import patch
from backend.Questionnaire import (
    calculate_transport_emissions,
    calculate_diet_emissions,
    calculate_heating_emissions,
    calculate_turn_off_devices_emissions,
    calculate_recycle_emissions,
    calculate_reusable_emissions,
    calculate_food_waste_emissions,
    update_transport_emissions,
    update_diet_emissions,
    update_heating_emissions,
    update_reusable_emissions,
    less_than_zero,
    Questionnaire,
)

class TestQuestionnaireFullCoverage(unittest.TestCase):
    @patch('backend.Questionnaire.get_user_activity_count_total')
    def test_calculate_projected_carbon_footprint_basic(self, mock_counts):
        """ Basic calculation check """
        answers = {
            "transportMethod": 3,
            "travelDistance": 2,
            "officeDays": 3,
            "dietDays": 5,
            "meats": 0,
            "heatingHours": 4,
            "turnOffDevices": 2,
            "recycle": 1,
            "reusable": 2,
            "foodWaste": 2
        }
        mock_counts.return_value = []
        q = Questionnaire(answers, user_id=123, start_date=datetime(2025, 1, 1))
        result = q.calculate_projected_carbon_footprint()
        # Check keys
        for key in ("total_projected", "projected", "current",
                    "transport_emissions", "diet_emissions", "heating_emissions",
                    "turn_off_devices_emissions", "recycle_emissions",
                    "reusable_emissions", "food_waste_emissions"):
            self.assertIn(key, result)
            self.assertIsInstance(result[key], int)

    def test_helpers_basic(self):
        # Smoke tests for helper functions
        self.assertGreaterEqual(calculate_transport_emissions(3, 2, 1), 0)
        self.assertGreater(calculate_diet_emissions(0, 1), 0)
        self.assertGreater(calculate_heating_emissions(2), 0)
        self.assertGreater(calculate_turn_off_devices_emissions(1), 0)
        self.assertGreater(calculate_recycle_emissions(2), 0)
        self.assertGreater(calculate_reusable_emissions(1), 0)
        self.assertGreater(calculate_food_waste_emissions(2), 0)
        self.assertEqual(less_than_zero(-5), 0)
        self.assertEqual(less_than_zero(0), 0)
        self.assertEqual(less_than_zero(10), 10)

    @patch('backend.Questionnaire.get_user_activity_count_total')
    def test_activity_branches(self, mock_counts):
        """ Test all special branches for activities """
        # Provide counts that hit all branches
        mock_counts.return_value = [
            (1, 2), (2, 1), (3, 1), (4, 1), (5, 1),
            (6, 1), (7, 1), (8, 1), (9, 1), (11, 1), (13, 4), (15, 1)
        ]

        answers = {
            "transportMethod": 3,
            "travelDistance": 2,
            "officeDays": 3,
            "dietDays": 1,
            "meats": 0,
            "heatingHours": 2,
            "turnOffDevices": 1,
            "recycle": 0,
            "reusable": 2,
            "foodWaste": 1
        }
        q = Questionnaire(answers, user_id=99, start_date=datetime(2025, 1, 1))
        result = q.calculate_projected_carbon_footprint()
        # Check that all numeric results are integers
        for key, value in result.items():
            self.assertIsInstance(value, int)

    @patch('backend.Questionnaire.get_user_activity_count_total')
    def test_activity_edge_conditions(self, mock_counts):
        """ Test activity branches that depend on conditions """
        # tef_index != 3 for activities 4 and 6 (public transport / carpool)
        mock_counts.return_value = [(4, 1), (6, 1), (7, 1)]
        answers = {
            "transportMethod": 2,  # not a car
            "travelDistance": 1,
            "officeDays": 3,
            "dietDays": 0,  # triggers no diet reduction in activity 7
            "meats": 0,
            "heatingHours": 2,
            "turnOffDevices": 1,
            "recycle": 0,
            "reusable": 1,
            "foodWaste": 1
        }
        q = Questionnaire(answers, user_id=100, start_date=datetime(2025, 1, 1))
        result = q.calculate_projected_carbon_footprint()
        self.assertIn("current", result)

    @patch('backend.Questionnaire.get_user_activity_count_total')
    def test_recycle_branches(self, mock_counts):
        """ Test all recycling if/elif branches """
        counts = [(13, 5)]
        for recycle_index in range(4):
            mock_counts.return_value = counts
            answers = {
                "transportMethod": 0,
                "travelDistance": 0,
                "officeDays": 1,
                "dietDays": 1,
                "meats": 0,
                "heatingHours": 1,
                "turnOffDevices": 0,
                "recycle": recycle_index,
                "reusable": 1,
                "foodWaste": 1
            }
            q = Questionnaire(answers, user_id=101, start_date=datetime(2025, 1, 1))
            result = q.calculate_projected_carbon_footprint()
            self.assertIn("recycle_emissions", result)

    def test_format_and_set_methods(self):
        answers = {
            "transportMethod": 1,
            "travelDistance": 1,
            "officeDays": 2,
            "dietDays": 3,
            "meats": 2,
            "heatingHours": 5,
            "turnOffDevices": 1,
            "recycle": 0,
            "reusable": 1,
            "foodWaste": 0
        }
        q = Questionnaire(answers, user_id=102, start_date=datetime(2025, 1, 1))
        # format_answers
        formatted = q.format_answers()
        self.assertEqual(formatted[0], 102)
        self.assertEqual(len(formatted), 11)
        # format_prompt
        prompt = q.format_prompt()
        self.assertIsInstance(prompt["travel_distance"], float)
        self.assertIn(prompt["transport_method"], ["Work from home", "Walk/Cycle", "Public transport", "Petrol car", "Electric car"])
        self.assertIn(prompt["meat_choice"], ["Beef", "Lamb", "Pork", "Chicken", "Turkey", "Fish"])
        # set_projected_carbon
        q.set_projected_carbon(1000)
        self.assertNotEqual(q.projected_carbon, -99)

if __name__ == "__main__":
    unittest.main()
