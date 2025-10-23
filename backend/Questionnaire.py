from datetime import datetime

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

        # "Work from home": 0.3
        # "Walk / Cycle": 0.2,
        # "Public Transport": 0.8,
        # "Car (Petrol/Diesel)": 2.4,
        # "Car (Electric)": 1.2,

        transport_emissions = [0.3, 0.2, 0.8, 2.4, 1.2]

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

         # Get current date
        today = datetime.today()
        day_of_year = today.timetuple().tm_yday

        # Determine if current year is a leap year
        year = today.year
        is_leap = (year % 4 == 0 and (year % 100 != 0 or year % 400 == 0))
        days_in_year = 366 if is_leap else 365

        # Calculate year progress
        year_progress = day_of_year / days_in_year
        current_value = total * year_progress

        return {
            "annual_total": round(total, 2),
            "current_to_date": round(current_value, 2),
            "year_progress_percent": round(year_progress * 100, 2)
        }