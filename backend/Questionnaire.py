from datetime import datetime
from backend.data_access import *

# --------- Emission Factors ------------

# Transport options kg CO2 / km
# Work from home, Walk/Cycle, Public Transport (Bus/Train), Car (Petrol/Deisel), Car (Electic)
transport_emission_factors = [0.0, 0.0, 0.05, 0.25, 0.05]

# Travel distance (miles)  
# 0-5, 5-10, 10-15, 15-20, 20-30, 30+
travel_distance = [2.5, 7.5, 12.5, 17.5, 25, 40]

# Meats eaten kg Co2 (Assumes 200g eaten)
# Beef, Lamb, Pork, Chicken, Turkey, Fish
meat_eaten = [10.0, 8.0, 2.0, 1.6, 2.4, 1.4]

# -------------- Functions to calculate/adjust projected carbon footprint -----------------

def calculate_transport_emissions(tef_index, td_index, office_days):
    # Travel dist * 2 because return journey
    # Assumes 48 working weeks in the year
    # print(tef_index, td_index)
    return transport_emission_factors[tef_index] * (travel_distance[td_index] * 2) * office_days * 48

def update_transport_emissions(tef_index, td_index, count):
    return transport_emission_factors[tef_index] * (travel_distance[td_index] * 2) * count


def calculate_diet_emissions(me_index, days_eating_meat):
    # Assumes meat eating habits year round
    return days_eating_meat * meat_eaten[me_index] * 52 # kg CO2 / year

def update_diet_emissions(me_index, count):
    return meat_eaten[me_index] * count


def calculate_heating_emissions(heating_hours):
    # Assumes 10 kWh/hour boiler
    # 0.2 is the heating emission factor kg CO2 / hour
    # Assumes heating on for winter months only = 90 days
    return heating_hours * 0.2 * 10 * 90 # kg CO2 / year

def update_heating_emissions(heating_hours, count):
    return heating_hours * 0.2 * 10 * count


class Questionnaire:
    def __init__(self, answers, user_id, start_date):
        self._questionnaire = answers
        self._id = user_id
        self.start = datetime(start_date.year, start_date.month, start_date.day)
        self.end = datetime(2025, 12, 31)
        self.projected_carbon = -99

    def set_end_date(self, end_date):
        self.end = datetime(end_date.year, end_date.month, end_date.day)

    def get_year_progress(self):
        delta = self.end - self.start
        days_difference = delta.days
        return days_difference / 365

    def set_projected_carbon(self, total):
        percentage_progress = self.get_year_progress()
        self.projected_carbon = total * percentage_progress


    def format_answers(self):
        return (
            self._id,
            self._questionnaire["transportMethod"],
            self._questionnaire["travelDistance"],
            self._questionnaire["officeDays"],
            self._questionnaire["dietDays"],
            self._questionnaire["meats"],
            self._questionnaire["heatingHours"],
        )

    def get_questionnaire(self):
        return self._questionnaire

    def calculate_projected_carbon_footprint(self):
        """
        Calculates and returns the projected carbon footprint (in tonnes of CO₂)
        based on the user's answers to a SINGLE questionnaire
        """

        # Assign questionnaire answers to variables
        tef_index = self._questionnaire["transportMethod"]
        td_index = self._questionnaire["travelDistance"]
        office_days = self._questionnaire["officeDays"]
        days_eating_meat = self._questionnaire["dietDays"]
        me_index = self._questionnaire["meats"]
        heating_hours = self._questionnaire["heatingHours"]

        # Calculate footprint
        transport_emissions = calculate_transport_emissions(tef_index, td_index, office_days)
        diet_emissions = calculate_diet_emissions(me_index, days_eating_meat)
        heating_emissions = calculate_heating_emissions(heating_hours)

        total = transport_emissions + diet_emissions + heating_emissions
        percentage_progress = self.get_year_progress()
        transport = transport_emissions * percentage_progress
        diet = diet_emissions * percentage_progress
        heating = heating_emissions * percentage_progress
        self.set_projected_carbon(total)

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
                transport_emissions -= update_transport_emissions(tef_index, td_index, count)
            elif activity_id == 2:
                heating_emissions -= update_heating_emissions(heating_hours, count)
            elif activity_id == 3:
                transport_emissions -= update_transport_emissions(tef_index, td_index, count)
            elif activity_id == 4:
                if tef_index == 3: # If they usually drive a diesel car as that is the only one worse than public transport
                    transport_emissions -= update_transport_emissions(tef_index, td_index, count) 
                    transport_emissions += update_transport_emissions(2, td_index, count)
            elif activity_id == 5:
                transport_emissions -= update_transport_emissions(tef_index, td_index, count)      
            elif activity_id == 6:
                if tef_index == 3: # If they usually drive a diesel car as that is the only one worse than carpooling with 1 other person
                    transport_emissions -= update_transport_emissions(tef_index, td_index, count) * 0.5
            elif activity_id == 7:
                if days_eating_meat > 0:
                    diet_emissions -= update_diet_emissions(me_index, count)
            elif activity_id == 8:
                if tef_index == 3: # If they usually drive a diesel car as that is the only one worse than carpooling with 2 other people
                    transport_emissions -= update_transport_emissions(tef_index, td_index, count) * 0.66
            elif activity_id == 9:
                if tef_index == 3: # If they usually drive a diesel car as that is the only one worse than carpooling with 3 other people
                    transport_emissions -= update_transport_emissions(tef_index, td_index, count) * 0.75


        day_of_year = datetime.today().timetuple().tm_yday
        year_progress_today = day_of_year / 365

        current = (transport_emissions + diet_emissions + heating_emissions) * percentage_progress * year_progress_today

        return {"total_projected": round(self.projected_carbon),
                "projected": round(self.projected_carbon * year_progress_today),
                "current": round(current),
                "transport_emissions": round(transport),
                "diet_emissions": round(diet),
                "heating_emissions": round(heating)}