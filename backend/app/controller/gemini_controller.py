from google.generativeai import GenerativeModel, configure
import os

# Configure Gemini using environment variable
configure(api_key=os.getenv("GEMINI_API_KEY"))
model = GenerativeModel("gemini-1.5-flash")

def generate_ai_response(prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return "Error generating response. Please try again later."
