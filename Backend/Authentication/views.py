from django.views import View
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_str, force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth import authenticate
from django.urls import reverse
from django.core.mail import EmailMessage
from django.shortcuts import redirect
from django.conf import settings

from .utils import token_generator
from .serializers import RegisterSerializer, send_activation_email, EmailThread
from .models import UserProfile

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

validate_email = EmailValidator()

class Register(APIView):
    permission_classes = []
    def post(self, request):
        serializer = RegisterSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()

            # save the user's email to a session.
            request.session['email'] = user.email

            return Response({"success": "User registered successfully. Please check your email to activate your account."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivateAccount(APIView):
    permission_classes=[]
    authentication_classes = []
    def get(self, request, uidb64, token):
        print(f"Activation attempt: uidb64={uidb64}, token={token}")  # HIT LOGGING
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk = uid)

            # check if token has already been user.
            if not token_generator.check_token(user, token):
                return redirect(f"{settings.FRONTEND_URL}/login")
            if user.is_active:
                return redirect(f"{settings.FRONTEND_URL}/login")
            user.is_active = True
            user.save()
            return redirect(f"{settings.FRONTEND_URL}/account-activated")
        except Exception as e:
            return Response({"error": f"An unknown error occured {e}"})
    
class ResendEmail(APIView):
    permission_classes=[]
    authentication_classes = []
    def post(self, request, email):

        if not email:
            return Response({"email_error": "Email field cannot be empty."}, status = status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(email=email).first()
        
        if not user:
             return Response({"email_error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

        if user.is_active:
            return Response({"email_error": "User is already active. Please log in instead."}, status=status.HTTP_400_BAD_REQUEST)
        
        try: 
            send_activation_email(request, user, email)
            return Response({"success": "Email was resent successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"email_error": f"Request for a new link failed {e}"}, status=status.HTTP_400_BAD_REQUEST)

class ResetPassword(APIView):
    permission_classes=[]
    authentication_classes = []
    def post(self, request):
        email = request.data.get('email', '')
        
        try:
            # validate the email.
            try:
                validate_email(email)
            except ValidationError as e:
                return Response({"email_error": "Invalid email address. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.get(email = email)

            if user:
                uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
                token = PasswordResetTokenGenerator().make_token(user)
                link = reverse('set-new-password', kwargs = {
                    "uidb64": uidb64,
                    "token": token
                })

                reset_url = f"{settings.BACKEND_URL}{link}"
                email_subject = "Password Reset"
                email_body = f"Hello {user.username}\n\nPlease use the link below to reset your password.\n\n{reset_url}"
                email_message = EmailMessage(email_subject, email_body, "noreply@telemed.com", [email])
                EmailThread(email_message).start()
            # generic message to user.
            return Response({"success": "Please check your email to complete resetting your password."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"email_error": "An error occured while trying to send the message."}, status=status.HTTP_400_BAD_REQUEST)

class SetNewPassword(APIView):
    permission_classes=[]
    authentication_classes = []
    def post(self, request, uidb64, token):
        password = request.data.get('password', '')
        confirm_password = request.data.get('confirm_password', "")

        if len(password) < 6:
            return Response({"password_error": "Password too short. Use more that six characters."}, status=status.HTTP_400_BAD_REQUEST)
        
        if password != confirm_password:
            return Response({"password_error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))

            user = User.objects.get(pk = uid)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({"invalid_token": "The token was invalid. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(password)
            user.save()
            return Response({"success": "Password changed successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"password_error": "Error occured sending the email."}, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    permission_classes=[]
    authentication_classes = []
    def post(self, request, *args, **kwargs):
        username_or_email = request.data.get("username_or_email")
        password = request.data.get("password")

       
        user = User.objects.filter(username=username_or_email).first() or \
        User.objects.filter(email = username_or_email).first()
        
        if not user:
            return Response({"error": "Invalid details provided."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.is_active:
            return Response({"error": "The user must be activated first for you to log in. Please check your email"}, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(username=user.username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            user_profile = UserProfile.objects.get(user=user)

            return Response ({
                "refresh": str(refresh),
                "token": str(refresh.access_token),
                "role": user_profile.role.name,
                "name": str(user.first_name.capitalize()) + " " + str(user.last_name.capitalize()),
                "username": user.username
            }, status =status.HTTP_200_OK)
        
        return Response({"error": "Invalid username or password."}, status=status.HTTP_400_BAD_REQUEST)
