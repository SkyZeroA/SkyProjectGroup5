import unittest
from unittest.mock import patch, MagicMock
import numpy as np

import backend.ai_functions as af


class TestAIFunctions(unittest.TestCase):
    def test_cosine_similarity(self):
        # identical vectors -> similarity 1
        self.assertAlmostEqual(af.cosine_similarity([1, 0], [1, 0]), 1.0)
        # orthogonal vectors -> similarity 0
        self.assertAlmostEqual(af.cosine_similarity([1, 0], [0, 1]), 0.0)

    def test_is_similar_tip_with_empty_buffer(self):
        # empty previous_tips should return False without calling embeddings
        self.assertFalse(af.is_similar_tip("a tip", []))

    def test_is_similar_tip_true_and_false(self):
        # Mock the OpenAI embeddings client to produce predictable embeddings
        mock_client = MagicMock()
        # Build response where new_emb == prev_emb gives cosine 1.0
        resp = MagicMock()
        resp.data = [MagicMock(embedding=[1.0, 0.0]), MagicMock(embedding=[1.0, 0.0])]
        mock_client.embeddings.create.return_value = resp

        with patch('backend.ai_functions.client', mock_client):
            # threshold low so equality -> True
            self.assertTrue(af.is_similar_tip("new", ["old"], threshold=0.5))

        # Build response where vectors are orthogonal -> similarity 0.0
        mock_client2 = MagicMock()
        resp2 = MagicMock()
        resp2.data = [MagicMock(embedding=[1.0, 0.0]), MagicMock(embedding=[0.0, 1.0])]
        mock_client2.embeddings.create.return_value = resp2

        with patch('backend.ai_functions.client', mock_client2):
            self.assertFalse(af.is_similar_tip("new", ["old"], threshold=0.5))

    def test_convert_db_to_prompt_uses_questionnaire(self):
        # Patch get_latest_answers_from_questionnaire and Questionnaire.format_prompt
        fake_answers = {"transportMethod": 1, "travelDistance": 2, "officeDays": 3, "dietDays": 4, "meats": 0, "heatingHours": 2}
        with patch('backend.ai_functions.get_latest_answers_from_questionnaire', return_value=fake_answers):
            mock_q = MagicMock()
            mock_q.format_prompt.return_value = {
                "office_days": 3,
                "transport_method": "Walk",
                "travel_distance": 7.5,
                "diet_days": 4,
                "meat_choice": "Beef",
                "heating_hours": 2,
            }
            with patch('backend.ai_functions.Questionnaire', return_value=mock_q):
                prompt = af.convert_db_to_prompt('a@b.com')
                self.assertIsInstance(prompt, str)
                self.assertIn('lifestyle_profile', prompt)
                self.assertIn('transport', prompt)

    def test_generate_tip_basic_and_regeneration(self):
        # Test basic generation path and regeneration when tip is similar/duplicate
        with patch('backend.ai_functions.get_tips_from_db', return_value=[]), \
             patch('backend.ai_functions.convert_db_to_prompt', return_value='pseudo prompt'):

            # Create two response objects to simulate regeneration
            resp1 = MagicMock()
            resp1.output_text = 'duplicate tip'
            resp2 = MagicMock()
            resp2.output_text = 'unique tip'

            mock_client = MagicMock()
            # responses.create should be called; return first then second
            mock_client.responses.create.side_effect = [resp1, resp2]

            # First call to is_similar_tip -> True (forces regeneration), second -> False
            with patch('backend.ai_functions.is_similar_tip', side_effect=[True, False]):
                with patch('backend.ai_functions.client', mock_client):
                    tip = af.generate_tip('a@b.com')
                    self.assertEqual(tip, 'unique tip')

            # Now test simple path where generated tip is accepted immediately
            mock_client2 = MagicMock()
            resp_ok = MagicMock()
            resp_ok.output_text = 'a good actionable tip'
            mock_client2.responses.create.return_value = resp_ok
            with patch('backend.ai_functions.is_similar_tip', return_value=False):
                with patch('backend.ai_functions.client', mock_client2):
                    tip2 = af.generate_tip('a@b.com')
                    self.assertEqual(tip2, 'a good actionable tip')


if __name__ == '__main__':
    unittest.main()
