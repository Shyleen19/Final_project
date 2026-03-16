from rest_framework import serializers
from .models import Vital

class VitalSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user_profile.user.get_full_name', read_only=True)

    class Meta:
        model = Vital
        fields = [
            'id', 'user_profile', 'user', 'systolic_bp', 'diastolic_bp', 'body_weight', 'heart_rate', 'edema', 'shortness_of_breath', 'recorded_at'
        ]

        read_only_fields = ['id', 'user_profile' ,'user', 'recorded_at']