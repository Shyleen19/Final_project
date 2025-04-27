from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Role, Doctor,Patient,Caregiver

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'email']


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    role = RoleSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = Doctor
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = Patient
        fields = '__all__'

class CaregiverSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only =True)

    class Meta:
        model = Caregiver
        fields = '__all__'
    
