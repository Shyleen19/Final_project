from django.urls import path
from .views import PatientCaregiversView, DeleteCaregiverView, CaregiverPatientsView, AddCaregiverView

urlpatterns = [
    path('', PatientCaregiversView.as_view(), name='caregiver-list'),
    path('<int:pk>/delete/', DeleteCaregiverView.as_view(), name='delete-caregiver'),
    path('add-caregiver/', AddCaregiverView.as_view(), name='=add-caregiver'),
    path('my-patients/', CaregiverPatientsView.as_view(), name='patient-list'),
    
]
