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

        # Transport options g CO2 / km
        # Work from home, Walk/Cycle, Public Transport (Bus/Train), Car (Petrol/Deisel), Car (Electic)
        transport_emission_factors = [0.0, 0.0, 0.05, 0.25, 0.05]

        # Travel distance (miles)
        # 0-5, 5-10, 10-15, 15-20, 20-30, 30+
        travel_distance = [2.5, 7.5, 12.5, 17.5, 25, 40]
        
        # Meats eaten g Co2 (Assumes 200g eaten)
        # Beef, Lamb, Pork, Chicken, Turkey, Fish
        meat_eaten = [10.0, 8.0, 2.0, 1.6, 2.4, 1.4]

        tef_index, td_index, office_days, days_eating_meat, me_index, heating_hours = self._questionnaire.values()

        # Calculate footprint
        # Travel dist * 2 because return journey
        # Assumes 48 working weeks in the year
        transport_emissions = transport_emission_factors[tef_index] * (travel_distance[td_index] * 2) * office_days * 48 # kg CO2 / year

        # Assumes meat eating habits year round
        diet_emissions = days_eating_meat * meat_eaten[me_index] * 52 # kg CO2 / year

        # Assumes 10 kWh/hour boiler
        # 0.2 is the heating emission factor g CO2 / hour
        # Assumes heating on for winter months only = 90 days
        heating_emissions = heating_hours * 0.2 * 10 * 90 # kg CO2 / year

        total = transport_emissions + diet_emissions + heating_emissions

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
            "annual_total": round(total),
            "current_to_date": round(current_value),
            "year_progress_percent": round(year_progress * 100)
        }