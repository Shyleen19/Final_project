from django.urls import path
from .views import PatientCaregiversView, UpdateCaregiverView, DeleteCaregiverView, CaregiverPatientsView

urlpatterns = [
    path('', PatientCaregiversView.as_view(), name='caregiver-list'),
    path('<int:pk>/delete/', DeleteCaregiverView.as_view(), name='delete_caregiver'),
    path('my-patients/', CaregiverPatientsView.as_view(), name='patient-list'),
    
]
