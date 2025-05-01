from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import Caregiver
from Authentication.models import UserProfile
from .serializers import CaregiverSerializer
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied

# List Caregivers (GET)
class PatientCaregiversView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CaregiverSerializer

    def get_queryset(self):
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        return Caregiver.objects.filter(patient=user_profile)


# Update Caregiver (PUT)
class UpdateCaregiverView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Caregiver.objects.all()
    serializer_class = CaregiverSerializer

    def get_object(self):
        caregiver = get_object_or_404(Caregiver, id=self.kwargs['pk'])
        if caregiver.patient.user != self.request.user:
            raise PermissionDenied("You are not allowed to update this caregiver.")
        return caregiver


# Delete Caregiver (DELETE)
class DeleteCaregiverView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Caregiver.objects.all()
    serializer_class = CaregiverSerializer

    def get_object(self):
        caregiver = get_object_or_404(Caregiver, id=self.kwargs['pk'])
        if caregiver.patient.user != self.request.user:
            raise PermissionDenied("You are not allowed to delete this caregiver.")
        return caregiver
