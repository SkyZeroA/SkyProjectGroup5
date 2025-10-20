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

        # "Walk / Cycle": 0.2,
        # "Public Transport": 0.8,
        # "Car (Petrol/Diesel)": 2.4,
        # "Car (Electric)": 1.2,
        # "Work from home": 0.3
        transport_emissions = [0.2, 0.8, 2.4, 1.2, 0.3]

        # "Meat-based": 2.5,
        # "Mixed": 1.7,
        # "Vegetarian": 1.0,
        # "Vegan": 0.6
        diet_emissions = [2.5, 1.7, 1.0, 0.6]

        # "Very efficient (modern insulation, LED lights, smart appliances)": 0.8,
        # "Moderately efficient (some energy-saving features)": 1.5,
        # "Not very efficient (older building or appliances)": 2.5
        energy_efficiency_emissions = [0.8, 1.5, 2.5]

        transport, diet, efficiency = self._questionnaire.values()

        # Calculate footprint
        total = (
            transport_emissions[transport] +
            diet_emissions[diet] +
            energy_efficiency_emissions[efficiency]
        )

        return round(total, 2)