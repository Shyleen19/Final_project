from rest_framework import serializers
from Caregivers.models import Caregiver

class CaregiverSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='caregiver.user.first_name')
    last_name = serializers.CharField(source='caregiver.user.last_name')
    email = serializers.EmailField(source='caregiver.user.email')
    
    first_name = first_name.capitlize()
    last_name = last_name.capitalize()
    
    class Meta:
        model = Caregiver
        fields = ['id', 'first_name', 'last_name', 'email', 'relationship_with_patient']

class PatientSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='patient.user.first_name')
    last_name = serializers.CharField(source='patient.user.last_name')
    email = serializers.EmailField(source='patient.user.email')
    user_id = serializers.IntegerField(source = 'patient.user.id')
   

    class Meta:
        model = Caregiver
        fields = ['id', 'first_name', 'last_name', 'email', 'relationship_with_patient', 'user_id']
