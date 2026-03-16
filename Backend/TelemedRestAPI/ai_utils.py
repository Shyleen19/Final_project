import os
import logging
from openai import OpenAI
import environ

# Initialize environment variables
env = environ.Env()

# Set up logging
logger = logging.getLogger(__name__)

def get_openai_client():
    """
    Initialize and return the OpenAI client.
    """
    api_key = env('OPENAI_API_KEY', default=None)
    if not api_key:
        logger.error("OPENAI_API_KEY not found in environment variables.")
        return None
    return OpenAI(api_key=api_key)

def ask_ai(question, history=None, system_prompt="You are a customer support assistant for DialiCare, a real-time monitoring app for CKD (Chronic Kidney Disease) patients undergoing dialysis treatment in Kenya. DialiCare records and stores patient vitals, then analyzes the data. If the vitals are abnormal or high, it notifies the patient they are in a 'danger zone' via an alarm. Patients can share their vitals with a caregiver who can monitor them remotely and receive emergency alerts. Only answer questions related to DialiCare information, CKD health, and dialysis treatment. Keep your responses very short and concise (1-2 sentences) to allow the patient to understand first. Always end your response with a brief follow-up question. Maintain continuity in the conversation and do not divert from the current topic or conversation flow at any point."):
    """
    Wrapper function to send a question to the OpenAI API and return the response.
    """
    client = get_openai_client()
    if not client:
        return "Error: AI client not configured."

    # Build messages with history if provided
    messages = [{"role": "system", "content": system_prompt}]
    
    if history:
        for msg in history:
            # map frontend 'bot'/'user' to openai 'assistant'/'user'
            role = "assistant" if msg.get("sender") == "bot" else "user"
            messages.append({"role": role, "content": msg.get("text")})
    
    # Add the current question
    messages.append({"role": "user", "content": question})

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.exception(f"Error occurred while asking AI: {e}")
        return f"Error: {str(e)}"
