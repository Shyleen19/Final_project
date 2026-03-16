from django.urls import path
from .views import ActivateAccount, Register, ResendEmail, ResetPassword, SetNewPassword, LoginAPIView

urlpatterns = [
    path('register/', Register.as_view(), name='register-user'),
    path('activate_account/<uidb64>/<token>/', ActivateAccount.as_view(), name='activate-account'),
    path('resend-email/<str:email>/', ResendEmail.as_view(), name='resend_email'),
    path('reset-password/', ResetPassword.as_view(), name='reset-password'),
    path('set-new-password/<uidb64>/<token>/', SetNewPassword.as_view(), name='set-new-password'),
    path('login/', LoginAPIView.as_view(), name='login'),
    
]