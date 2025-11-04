from openai import OpenAI
import os
from dotenv import load_dotenv
from backend.data_access import get_latest_answers_from_questionnaire, get_tips_from_db
from backend.Questionnaire import Questionnaire
from datetime import datetime
import numpy as np

# Load API key
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def cosine_similarity(a, b):
    a, b = np.array(a), np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def is_similar_tip(new_tip, previous_tips, threshold=0.75):
    """Return True if the new_tip is semantically similar to any in previous_tips."""
    if not previous_tips:
        return False

    # Get embeddings for all tips
    texts = [new_tip] + previous_tips
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )
    embeddings = [e.embedding for e in response.data]
    new_emb, buffer_embs = embeddings[0], embeddings[1:]

    # Compare new tip to each previous tip
    for emb in buffer_embs:
        sim = cosine_similarity(new_emb, emb)
        if sim > threshold:
            return True
    return False


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
    # Fetch the user's buffer from the DB
    tip_buffer = get_tips_from_db(email) or []

    # Convert user questionnaire to pseudo-prompt
    prompt = convert_db_to_prompt(email)

    system_prompt = f"""
        You are an expert in low-carbon lifestyles.
        The user has provided their habits as structured pseudo-code describing their lifestyle.

        Analyze this pseudo-code carefully and generate ONE short, actionable tip to help them reduce their carbon footprint.

        Rules:
        - The tip must directly relate to at least one parameter in the pseudo-code.
        - The tip must be a single concise sentence (maximum 120 characters).
        - Avoid repeating or rephrasing previous tips: {tip_buffer}.
        - Be creative — suggest new practical actions or habits, phrased differently each time.
        - Do NOT mention carbon numbers or emissions, only practical actions.
    """.strip()

    response = client.responses.create(
        model="gpt-4.1-nano",
        temperature=1.1,
        max_output_tokens=60,
        instructions=system_prompt,
        input=prompt,
    )

    tip = response.output_text.strip()

    # Check semantic similarity
    if tip in tip_buffer or is_similar_tip(tip, tip_buffer):
        print("Tip too similar — regenerating...")
        return generate_tip(email)  # Regenerate until we get a unique one

    return tip



if __name__ == "__main__":
    tip = generate_tip()
    print(tip)
