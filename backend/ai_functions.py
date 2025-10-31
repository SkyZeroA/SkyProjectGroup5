from openai import OpenAI
import os
from dotenv import load_dotenv
from backend.data_access import get_latest_answers_from_questionnaire
from backend.Questionnaire import Questionnaire
from datetime import datetime

# Load API key
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

MAX_TIPS = 5
RECENT_TIPS = []

def convert_db_to_prompt(email):
    answers = get_latest_answers_from_questionnaire(email)
    questionnaire = Questionnaire(answers, 0, datetime.today())
    lifestyle_dict = questionnaire.format_prompt()

    pseudo_prompt = f"""
        lifestyle_profile = {{
            transport(office_days={lifestyle_dict["office_days"]}, method="{lifestyle_dict["transport_method"]}", distance_miles={lifestyle_dict["travel_distance"]})
            diet(meat_meals_per_day=2, meat_days_per_week={lifestyle_dict["diet_days"]}, most_common_meat={lifestyle_dict["meat_choice"]})
            heating(hours_per_day={lifestyle_dict["heating_hours"]}, months_active=["December", "January", "February"])
        }}
    """.strip()

    return pseudo_prompt


def generate_tip(email):
    prompt = convert_db_to_prompt(email)

    system_prompt = f"""
        You are an expert in low-carbon lifestyles.
        The user has provided their habits as structured pseudo-code describing their lifestyle.

        Analyze this pseudo-code carefully and generate ONE short, actionable tip to help them reduce their carbon footprint.

        Rules:
        - The tip must directly relate to at least one parameter in the pseudo-code.
        - The tip must be a single concise sentence (maximum 120 characters).
        - Avoid repeating recent tips: {RECENT_TIPS}.
        - Do NOT mention carbon numbers or emissions, only practical actions.
        """.strip()

    response = client.responses.create(
        model="gpt-4.1-nano",
        temperature=1.0,
        max_output_tokens=60,
        instructions=system_prompt,
        input=prompt,
    )

    tip = response.output_text.strip()

    # Avoid repeats
    if tip in RECENT_TIPS:
        return generate_tip()

    if len(RECENT_TIPS) >= MAX_TIPS:
        RECENT_TIPS.pop(0)
    RECENT_TIPS.append(tip)

    return tip


if __name__ == "__main__":
    tip = generate_tip()
    print(tip)
