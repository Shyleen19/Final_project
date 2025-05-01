from rest_framework import serializers
from Caregivers.models import Caregiver

class CaregiverSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='caregiver.user.first_name')
    last_name = serializers.CharField(source='caregiver.user.last_name')
    email = serializers.EmailField(source='caregiver.user.email')
    
    class Meta:
        model = Caregiver
        fields = "__all__"
        