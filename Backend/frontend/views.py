from django.shortcuts import render
from django.views import View


# Create your views here.
# mainly renders html files to the frontend.

# authentication.
class RegisterPage(View):
    def get(self, request):
        return render(request, 'authentication/register.html')

class ConfirmEmailPage(View):
    def get(self, request):
        return render(request, 'authentication/confirm_email.html')

class ResetPasswordPage(View):
    def get(self, request):
        return render(request, 'authentication/reset_password.html')

class SetNewPasswordPage(View):
    def get(self, request, uidb64, token):
        return render(request, 'authentication/set_new_password.html', {"uidb64": uidb64, "token": token})

class LoginPage(View):
    def get(self, request):
        return render(request, 'authentication/login.html')


