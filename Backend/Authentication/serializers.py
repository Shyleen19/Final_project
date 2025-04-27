from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Role, Doctor
from django.core.mail import EmailMessage
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError


import threading
from django.conf import settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import token_generator

validate_email = EmailValidator()

class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all())
    confirm_password = serializers.CharField(write_only=True)

    # Doctor specific fields.
    specialty = serializers.CharField(required=False, allow_blank=True,allow_null = True)
    license_number = serializers.CharField(required=False, allow_blank= True, allow_null = True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password', 'confirm_password', 'role', 'specialty', 'license_number']
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, data):

        email = data.get('email', '').strip()

        try:    
            validate_email(email)
        except ValidationError:
            raise serializers.ValidationError({"email_error": "The email is invalid."})
        
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email_error": "A user with that email already exists."})
        if len(data['password']) < 6:
            raise serializers.ValidationError({"password_error": "Password too short. Use at least 6 characters."})
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password_error": "Passwords do not match"} )
        
        # ensure doctor fields are provided if the role is doctor.
        if data['role'].name.lower() == "doctor":
            if not data['specialty'] or not data['license_number']:
                raise serializers.ValidationError({"doctor_error": "Specialy and license number are required for the doctor."})
        else:
            data.pop('specialty', None)
            data.pop('license_number', None)
        
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        role = validated_data.pop('role')
        specialty = validated_data.pop('specialty', None)
        license_number = validated_data.pop('license_number', None)

        user = User.objects.create_user(is_active=False, **validated_data)
                
        user_profile = UserProfile.objects.create(user=user, role=role)

        if role.name.lower() == "doctor":
            Doctor.objects.create(user_profile=user_profile, specialty = specialty, license_number = license_number)
        

        # send email verification.
        send_activation_email(self.context.get('request'), user, user.email)

        return user

class EmailThread(threading.Thread):
    # speed up the sending of the email and response back to the user.
    
    def __init__(self, email):
       self.email = email
       threading.Thread.__init__(self)
       
    def run(self):
        self.email.send(fail_silently = False)

def send_activation_email(request, user, email):
    try:
        if not request:
            raise serializers.ValidationError({"email_error": "Request object was required to send email successfully."})
        
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)
        try:
            domain = get_current_site(request).domain
        except Exception:
            raise serializers.ValidationError({"email_error": "Failed to fetch domain."})
        
        link = reverse('activate-account', kwargs= {
            'uidb64': uidb64,
            'token': token
        })
        activate_url = f"{request.scheme}://{domain}{link}"
        email_subject = "Activate your account"
        email_body = f"Hello {user.username}, \n\n To activate your account, click on the link below:\n\n {activate_url}"
        email_message = EmailMessage(email_subject, email_body, settings.DEFAULT_FROM_EMAIL, [email])
        EmailThread(email_message).start()
    except Exception as e:
        print (f"Email error: {e}")
        raise serializers.ValidationError({"email_error": "Email was not sent. Please try again."})