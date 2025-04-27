from django.shortcuts import render
from rest_framework import generics
from Authentication.models import Role
from .serializers import RoleSerializer

# Create your views here.
class RoleListView(generics.ListAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
