from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import Caregiver
from Authentication.models import UserProfile
from .serializers import CaregiverSerializer, PatientSerializer, CreateCaregiverSerializer
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from rest_framework.views import APIView

# List Caregivers (GET)
class PatientCaregiversView(generics.ListAPIView): # list all caregivers for a patient.
    serializer_class = CaregiverSerializer

    def get_queryset(self):
        user_profile = get_object_or_404(UserProfile, user=self.request.user)
        # Proactively update status if a caregiver has already registered but status is still Pending
        pending_caregivers = Caregiver.objects.filter(patient=user_profile, status='Pending')
        for cg in pending_caregivers:
            try:
                # Check if a UserProfile exists for this email
                matching_profile = UserProfile.objects.get(user__email__iexact=cg.email)
                cg.caregiver = matching_profile
                cg.status = 'Accepted'
                cg.save()
            except UserProfile.DoesNotExist:
                pass
        return Caregiver.objects.filter(patient=user_profile)

class AddCaregiverView(APIView):
    def post(self, request):
        serializer=CreateCaregiverSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"success": "Caregiver added successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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