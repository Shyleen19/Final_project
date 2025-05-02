from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import Caregiver
from Authentication.models import UserProfile
from .serializers import CaregiverSerializer, PatientSerializer
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from rest_framework.views import APIView

# List Caregivers (GET)
class PatientCaregiversView(generics.ListAPIView): # list all caregivers for a patient.
    serializer_class = CaregiverSerializer

    def get_queryset(self):
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        return Caregiver.objects.filter(patient=user_profile).distinct()


# Update Caregiver (PUT)
class UpdateCaregiverView(generics.UpdateAPIView):
    queryset = Caregiver.objects.all()
    serializer_class = CaregiverSerializer

    def get_object(self):
        caregiver = get_object_or_404(Caregiver, id=self.kwargs['pk'])
        if caregiver.patient.user != self.request.user:
            raise PermissionDenied("You are not allowed to update this caregiver.")
        return caregiver


# Delete Caregiver (DELETE)
class DeleteCaregiverView(generics.DestroyAPIView):
    queryset = Caregiver.objects.all()
    serializer_class = CaregiverSerializer

    def get_object(self):
        caregiver = get_object_or_404(Caregiver, id=self.kwargs['pk'])
        if caregiver.patient.user != self.request.user:
            raise PermissionDenied("You are not allowed to delete this caregiver.")
        return caregiver

class CaregiverPatientsView(generics.ListAPIView): # list all patients for a caregiver.
    queryset = Caregiver.objects.all()
    serializer_class = PatientSerializer
 
    def get_queryset(self):
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        return Caregiver.objects.filter(caregiver=user_profile).distinct()