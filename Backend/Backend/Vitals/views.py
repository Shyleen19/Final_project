from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from .models import Vital
from Caregivers.models import Caregiver
from .serializers import VitalSerializer
from Authentication.models import UserProfile

User = get_user_model()
class VitalListCreateView(APIView):
    
    def get(self, request, user_id = None):
        if user_id:
            user = get_object_or_404(User, id=user_id)
        else:
            user = request.user

        user_profile = get_object_or_404(UserProfile, user=user)

        # If accessing someone else's data
        if user_id and user != request.user:
            caregiver_profile = get_object_or_404(UserProfile, user=request.user)

            authorized = Caregiver.objects.filter(patient=user_profile, caregiver=caregiver_profile).exists()
            if not authorized:
                return Response({'error': 'Unauthorized access.'}, status=status.HTTP_403_FORBIDDEN)
        
        vitals = Vital.objects.filter(user_profile=user_profile).order_by('-recorded_at')

        if not vitals.exists():
            return Response({'message': 'No vitals found.'})
        
        last_vital = VitalSerializer(vitals.first()).data
        all_vitals = VitalSerializer(vitals, many=True).data

        return Response({
            'latest_vitals': last_vital,
            'vitals_history': all_vitals
        })

    def post(self, request):
        serializer = VitalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user_profile=request.user.userprofile)
            return Response({
                "vitals": serializer.data,
                "success": "Record created successfully"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        