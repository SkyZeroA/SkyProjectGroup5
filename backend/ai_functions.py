from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.responses.create(
    model = "gpt-4.1-nano",
    input = "give me one tip on having a low carbon lifestyle"
)

print(response.output_text)