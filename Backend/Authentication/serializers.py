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



    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password', 'confirm_password', 'role']
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
        

        
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        role = validated_data.pop('role')

        user = User.objects.create_user(is_active=False, **validated_data)
                
        user_profile = UserProfile.objects.create(user=user, role=role)


        

        # send email verification.
        send_activation_email(self.context.get('request'), user, user.email)

        # Automatically link to any pending caregiver invitations and mark as Accepted (using case-insensitive email)
        from Caregivers.models import Caregiver
        Caregiver.objects.filter(email__iexact=user.email).update(caregiver=user_profile, status='Accepted')

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
        link = reverse('activate-account', kwargs= {
            'uidb64': uidb64,
            'token': token
        })
        activate_url = f"{settings.BACKEND_URL}{link}"
        email_subject = "Activate your account"
        email_body = f"Hello {user.username}, \n\n To activate your account, click on the link below:\n\n {activate_url}"
        email_message = EmailMessage(email_subject, email_body, settings.DEFAULT_FROM_EMAIL, [email])
        EmailThread(email_message).start()
    except Exception as e:
        print (f"Email error: {e}")
        raise serializers.ValidationError({"email_error": "Email was not sent. Please try again."})