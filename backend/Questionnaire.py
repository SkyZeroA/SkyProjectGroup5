class Questionnaire:
    def __init__(self, answers, user_id):
        self._questionnaire = answers
        self._id = user_id

    def format_answers(self):
        output = list(self._questionnaire.values())
        output.insert(0, self._id)
        return tuple(output)

    def get_questionnaire(self):
        return self._questionnaire

    class Questionnaire:
    def __init__(self, answers, user_id):
        self._questionnaire = answers
        self._id = user_id

    def format_answers(self):
        output = list(self._questionnaire.values())
        output.insert(0, self._id)
        return tuple(output)

    def get_questionnaire(self):
        return self._questionnaire

    def calculate_projected_carbon_footprint(self):
        """
        Calculates and returns the projected carbon footprint (in tonnes of CO₂)
        based on the user's answers.
        """

        # Emission factors (tonnes CO₂ per year)
        transport_emissions = {
            "Walk / Cycle": 0.2,
            "Public Transport": 0.8,
            "Car (Petrol/Diesel)": 2.4,
            "Car (Electric)": 1.2,
            "Work from home": 0.3
        }

        diet_emissions = {
            "Meat-based": 2.5,
            "Mixed": 1.7,
            "Vegetarian": 1.0,
            "Vegan": 0.6
        }

        energy_efficiency_emissions = {
            "Very efficient (modern insulation, LED lights, smart appliances)": 0.8,
            "Moderately efficient (some energy-saving features)": 1.5,
            "Not very efficient (older building or appliances)": 2.5
        }

        # Extract user answers safely
        transport = self._questionnaire.get("question_one")
        diet = self._questionnaire.get("question_two")
        efficiency = self._questionnaire.get("question_three")

        # Calculate footprint (default 0 if no valid key)
        total = (
            transport_emissions.get(transport, 0) +
            diet_emissions.get(diet, 0) +
            energy_efficiency_emissions.get(efficiency, 0)
        )

        return round(total, 2)