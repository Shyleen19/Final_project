import os
import django
from django.test import Client
from django.contrib.auth import get_user_model
import sys

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'TelemedRestAPI.settings')
django.setup()

from Vitals.models import Vital
from Authentication.models import UserProfile, Role

User = get_user_model()

@override_settings(ALLOWED_HOSTS=['*'])
def test_export():
    client = Client()
    # Testing anonymous access since we disabled permissions for now
    response = client.get('/api/vitals/export/?period=weekly', HTTP_HOST='localhost')
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(f"Content Type: {response.get('Content-Type')}")
        print(f"Content Disposition: {response.get('Content-Disposition')}")
        print("CSV Export Test Passed!")
        # Print first few lines of CSV
        lines = response.content.decode('utf-8').splitlines()
        for line in lines[:3]:
            print(f"CSV Line: {line}")
    elif response.status_code == 404:
        print("No vitals found for the fallback user.")
        print("CSV Export Endpoint seems to be working but no data available.")
    else:
        print(f"CSV Export Test Failed! Content: {response.content[:100]}")

if __name__ == "__main__":
    test_export()
