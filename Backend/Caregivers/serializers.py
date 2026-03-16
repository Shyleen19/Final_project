from rest_framework import serializers
from Caregivers.models import Caregiver
from Authentication.models import UserProfile
from django.contrib.auth import get_user_model

User = get_user_model()

class CaregiverSerializer(serializers.ModelSerializer):
    display_first_name = serializers.CharField(source='caregiver.user.first_name', read_only=True, default='')
    display_last_name = serializers.CharField(source='caregiver.user.last_name', read_only=True, default='')
    email = serializers.EmailField()
    
    class Meta:
        model = Caregiver
        fields = ['id', 'display_first_name', 'display_last_name', 'first_name', 'last_name', 'email', 'relationship_with_patient', 'status']

class CreateCaregiverSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    relationship_with_patient = serializers.CharField()

    class Meta:
        model = Caregiver
        fields = ['email', 'first_name', 'last_name', 'relationship_with_patient']
    
    def create(self, validated_data):
        email = validated_data.get('email')
        relationship_with_patient = validated_data.get("relationship_with_patient")
        patient_profile = UserProfile.objects.get(user=self.context['request'].user)

        if not email or not relationship_with_patient:
            raise serializers.ValidationError("Both email and relationship are required.")

        if email == self.context['request'].user.email:
            raise serializers.ValidationError("You cannot add yourself as a caregiver.")

        if Caregiver.objects.filter(patient=patient_profile, email=email).exists():
            raise serializers.ValidationError("An invitation for this email already exists.")

        caregiver_profile = None
        try:
            user = User.objects.get(email=email)
            caregiver_profile = UserProfile.objects.get(user=user)
        except (User.DoesNotExist, UserProfile.DoesNotExist):
            pass

        # Create Caregiver record (invitation)
        caregiver_invitation = Caregiver.objects.create(
            caregiver=caregiver_profile,
            patient=patient_profile,
            email=email,
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            relationship_with_patient=relationship_with_patient,
            status='Pending'
        )

        # Send invitation email
        from django.core.mail import EmailMessage
        from django.conf import settings
        import threading

        class EmailThread(threading.Thread):
            def __init__(self, email_message):
                self.email_message = email_message
                threading.Thread.__init__(self)
            def run(self):
                self.email_message.send(fail_silently=False)
        
        subject = f"Invitation to join DialiCare as a Caregiver for {self.context['request'].user.get_full_name()}"
        caregiver_first_name = validated_data.get('first_name')
        registration_link = f"{settings.FRONTEND_URL}/register"
        
        message = (
            f"Hello {caregiver_first_name},\n\n"
            f"{self.context['request'].user.get_full_name()} has invited you to join DialiCare as their caregiver. "
            f"DialiCare helps patients and caregivers stay connected by tracking vital health information in real-time.\n\n"
            f"To get started, please register an account using this email address: {email}\n\n"
            f"Join here: {registration_link}\n\n"
            f"We look forward to having you on board!\n\n"
            f"Best regards,\n"
            f"The DialiCare Team"
        )
        
        email_message = EmailMessage(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email]
        )
        EmailThread(email_message).start()

        return caregiver_invitation


class PatientSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='patient.user.first_name')
    last_name = serializers.CharField(source='patient.user.last_name')
    email = serializers.EmailField(source='patient.user.email')
    user_id = serializers.IntegerField(source='patient.user.id')
    status = serializers.CharField()

    class Meta:
        model = Caregiver
        fields = ['id', 'first_name', 'last_name', 'email', 'relationship_with_patient', 'user_id', 'status']
