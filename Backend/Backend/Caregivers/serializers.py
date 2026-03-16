from rest_framework import serializers
from Caregivers.models import Caregiver
from Authentication.models import UserProfile
from django.contrib.auth import get_user_model

User = get_user_model()

class CaregiverSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='caregiver.user.first_name')
    last_name = serializers.CharField(source='caregiver.user.last_name')
    email = serializers.EmailField(source='caregiver.user.email')
    
    class Meta:
        model = Caregiver
        fields = ['id', 'first_name', 'last_name', 'email', 'relationship_with_patient']

class CreateCaregiverSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    relationship_with_patient = serializers.CharField()

    class Meta:
        model = Caregiver
        fields = ['email', 'relationship_with_patient']
    
    def create(self, validated_data):
        email = validated_data.get('email')
        relationship_with_patient = validated_data.get("relationship_with_patient")

        if not email or not relationship_with_patient:
            raise serializers.ValidationError("Both email and relatioship with caregiver are required.")

        try:
            user = User.objects.get(email=email)
            caregiver_profile = UserProfile.objects.get(user=user)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with  that email does not exist.")
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError( "Caregiver not found.")
        
        if user == self.context['request'].user:
            raise serializers.ValidationError("You cannot add yourself as a caregiver. Please try another person.")
        
        if not user.is_active:
            raise serializers.ValidationError("The user you entered is not active yet.")

        patient_profile = UserProfile.objects.get(user= self.context['request'].user)

        if Caregiver.objects.filter(caregiver=caregiver_profile, patient=patient_profile).exists():
            raise serializers.ValidationError("Caregiver exists in your profile.")

        return Caregiver.objects.create(
            caregiver=caregiver_profile,
            patient=patient_profile,
            relationship_with_patient= relationship_with_patient
        )


class PatientSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='patient.user.first_name')
    last_name = serializers.CharField(source='patient.user.last_name')
    email = serializers.EmailField(source='patient.user.email')
    user_id = serializers.IntegerField(source = 'patient.user.id')
   

    class Meta:
        model = Caregiver
        fields = ['id', 'first_name', 'last_name', 'email', 'relationship_with_patient', 'user_id']
