from django.urls import path

from .views import *

urlpatterns = [
    path("authenticate/register/", RegisterPage.as_view(), name='register-page'),
    path("authenticate/confirm-email/", ConfirmEmailPage.as_view(), name='confirm-email-page'),
    path("authenticate/reset-password/", ResetPasswordPage.as_view(), name='reset-password'),
    path('authenticate/set-new-password/<uidb64>/<token>/', SetNewPasswordPage.as_view(), name='set-new-password'),
    path('authenticate/login/', LoginPage.as_view(), name='login-page'),
]