from django.shortcuts import render
from .models import Profile, Doctor, Patient, Caregiver
from .serializers import ProfileSerializer, DoctorSerializer, PatientSerializer, CaregiverSerializer
from rest_framework import viewsets
from .permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticatedOrReadOnly


# Create your views here.

class ProfileViewset(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perfrom_create(self, serializer):
        serializer.save(user=self.request.user)


class DoctorViewset(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class PatientViewset(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class CaregiverViewset(viewsets.ModelViewSet):
    queryset = Caregiver.objects.all()
    serializer_class = CaregiverSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]