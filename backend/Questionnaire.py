from datetime import datetime
from backend.data_access import *

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

        # Transport options kg CO2 / km
        # Work from home, Walk/Cycle, Public Transport (Bus/Train), Car (Petrol/Deisel), Car (Electic)
        transport_emission_factors = [0.0, 0.0, 0.05, 0.25, 0.05]

        # Travel distance (miles)
        # 0-5, 5-10, 10-15, 15-20, 20-30, 30+
        travel_distance = [2.5, 7.5, 12.5, 17.5, 25, 40]
        
        # Meats eaten kg Co2 (Assumes 200g eaten)
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
        # 0.2 is the heating emission factor kg CO2 / hour
        # Assumes heating on for winter months only = 90 days
        heating_emissions = heating_hours * 0.2 * 10 * 90 # kg CO2 / year

        transport = transport_emissions
        diet = diet_emissions
        heating = heating_emissions
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
        projected = total * year_progress

        counts = get_user_activity_count_total(self._id)

        # ----------- Activity Key --------------
        # 1: Ride Bike
        # 2: Day without Heating
        # 3: Walk to Work
        # 4: Use Public Transport
        # 5: Extra WFH Day
        # 6: Carpooling with 1 other person
        # 7: Avoid meat
        # 8: Carpooling with 2 other people
        # 9: Carpooling with 3 other people
        # ---------------------------------------

        # What do we want to do in the case that a person who usually bikes to work ticks an activity that involves driving/public transport?
        # 1) Have it in the code that it will not increase their good green part of the bar (what i implemented)
        # 2) Have it reduce their green part of the bar

        for (activity_id, count) in counts:
            if activity_id == 1:
                transport_emissions -= transport_emission_factors[tef_index] * (travel_distance[td_index] * 2) * count
            elif activity_id == 2:
                heating_emissions -= heating_hours * 0.2 * 10 * count
            elif activity_id == 3:
                transport_emissions -= transport_emission_factors[tef_index] * (travel_distance[td_index] * 2) * count
            elif activity_id == 4:
                if tef_index == 3: # If they usually drive a diesel car as that is the only one worse than public transport
                    transport_emissions -= transport_emission_factors[tef_index] * (travel_distance[td_index] * 2) * count 
                    transport_emissions += transport_emission_factors[2] * (travel_distance[td_index] * 2) * count
            elif activity_id == 5:
                transport_emissions -= transport_emission_factors[tef_index] * (travel_distance[td_index] * 2) * count      
            elif activity_id == 6:
                if tef_index == 3: # If they usually drive a diesel car as that is the only one worse than carpooling with 1 other person
                    transport_emissions -= transport_emission_factors[tef_index] * (travel_distance[td_index] * 2) * count * 0.5
            elif activity_id == 7:
                if days_eating_meat > 0:
                    diet_emissions -= meat_eaten[me_index] * count
            elif activity_id == 8:
                if tef_index == 3: # If they usually drive a diesel car as that is the only one worse than carpooling with 2 other people
                    transport_emissions -= transport_emission_factors[tef_index] * (travel_distance[td_index] * 2) * count * 0.66
            elif activity_id == 9:
                if tef_index == 3: # If they usually drive a diesel car as that is the only one worse than carpooling with 3 other people
                    transport_emissions -= transport_emission_factors[tef_index] * (travel_distance[td_index] * 2) * count * 0.75

        current = (transport_emissions + diet_emissions + heating_emissions) * year_progress

        return {
            "transport_emissions": round(transport),
            "diet_emissions": round(diet),
            "heating_emissions": round(heating),
            "annual_total": round(total),
            "projected": round(projected),
            "current": round(current)
        }