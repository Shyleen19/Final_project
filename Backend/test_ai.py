import os
import django
from TelemedRestAPI.ai_utils import ask_ai

# Setup Django environment so we can use environ
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'TelemedRestAPI.settings')
django.setup()

def test_ask_ai_with_history():
    print("Testing ask_ai with history...")
    
    history = [
        {"sender": "user", "text": "What is DialiCare?"},
        {"sender": "bot", "text": "DialiCare is a real-time monitoring app for CKD patients in Kenya. Would you like to know how it records vitals?"}
    ]
    
    question = "Yes, tell me more about that."
    
    print("-" * 20)
    print(f"History: {history}")
    print(f"Question: {question}")
    response = ask_ai(question, history=history)
    print(f"Response: {response}")
    
    # Test diversion attempt
    history.append({"sender": "user", "text": question})
    history.append({"sender": "bot", "text": response})
    
    divert_question = "Actually, let's talk about football."
    print("-" * 20)
    print(f"Question: {divert_question}")
    response = ask_ai(divert_question, history=history)
    print(f"Response: {response}")

if __name__ == "__main__":
    test_ask_ai_with_history()
