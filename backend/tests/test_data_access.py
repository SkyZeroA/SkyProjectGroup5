from unittest import TestCase
from unittest.mock import MagicMock

class TestDataAccess(TestCase):
    def setUp(self):
        # Arrange: Set up mock data access and sample data
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

    def test_get_all(self):
        # Act: Call the method
        result = self.data_access.get_all()

        # Assert: Verify the result and interaction
        self.assertEqual(result, self.sample_data)
        self.data_access.get_all.assert_called_once()

    def test_get_by_id_found(self):
        # Act: Call the method with an existing ID
        result = self.data_access.get_by_id(1)

        # Assert: Verify the correct item is returned
        self.assertEqual(result, {"id": 1, "name": "Alice"})
        self.data_access.get_by_id.assert_called_once_with(1)

    def test_get_by_id_not_found(self):
        # Act: Call the method with a non-existent ID
        result = self.data_access.get_by_id(999)

        # Assert: Verify that None is returned
        self.assertIsNone(result)
        self.data_access.get_by_id.assert_called_once_with(999)

    def test_create(self):
        # Arrange: Prepare new data
        new_data = {"name": "David"}

        # Act: Call the create method
        result = self.data_access.create(new_data)

        # Assert: Verify the returned data includes a new ID
        expected_result = {"id": 4, "name": "David"}
        self.assertEqual(result, expected_result)
        self.data_access.create.assert_called_once_with(new_data)

    def test_update_found(self):
        # Arrange: Prepare updated data
        updated_data = {"name": "Alice Updated"}

        # Act: Call the update method with an existing ID
        result = self.data_access.update(1, updated_data)

        # Assert: Verify the updated result
        expected_result = {"id": 1, "name": "Alice Updated"}
        self.assertEqual(result, expected_result)
        self.data_access.update.assert_called_once_with(1, updated_data)

    def test_update_not_found(self):
        # Arrange: Prepare updated data for non-existent ID
        updated_data = {"name": "Nonexistent"}

        # Act: Call the update method with a non-existent ID
        result = self.data_access.update(999, updated_data)

        # Assert: Verify that None is returned
        self.assertIsNone(result)
        self.data_access.update.assert_called_once_with(999, updated_data)

    def test_delete_found(self):
        # Act: Call the delete method with an existing ID
        result = self.data_access.delete(1)

        # Assert: Verify that deletion was successful
        self.assertTrue(result)
        self.data_access.delete.assert_called_once_with(1)


