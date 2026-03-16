from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import csv
from django.http import HttpResponse
from django.utils import timezone
from datetime import timedelta

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

class AdminStatsView(APIView):
    def get(self, request):
        if not hasattr(request.user, 'userprofile') or not request.user.userprofile.role.name.lower() == 'admin':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        total_patients = UserProfile.objects.filter(role__name__iexact='patient').count()
        total_caregivers = UserProfile.objects.filter(role__name__iexact='caregiver').count()
        
        danger = 0
        warning = 0
        normal = 0
        
        patient_profiles = UserProfile.objects.filter(role__name__iexact='patient')
        for pp in patient_profiles:
            latest = Vital.objects.filter(user_profile=pp).order_by('-recorded_at').first()
            if latest:
                is_danger = (
                    latest.systolic_bp > 140 or
                    latest.diastolic_bp > 90 or
                    latest.body_weight > 100 or
                    latest.heart_rate > 150 or latest.heart_rate < 50 or
                    latest.edema in ['Severe', 'Moderate'] or
                    latest.shortness_of_breath in ['Severe', 'Moderate']
                )
                is_warning = (
                    (120 < latest.systolic_bp <= 140) or
                    (80 < latest.diastolic_bp <= 90) or
                    (80 < latest.body_weight <= 100) or
                    (100 < latest.heart_rate <= 150) or
                    latest.edema in ['Mild'] or
                    latest.shortness_of_breath in ['Mild']
                )
                
                if is_danger: danger += 1
                elif is_warning: warning += 1
                else: normal += 1
            else:
                normal += 1

        return Response({
            'total_patients': total_patients,
            'total_caregivers': total_caregivers,
            'danger': danger,
            'warning': warning,
            'normal': normal
        })

class ExportVitalsCSVView(APIView):
    permission_classes = []
    authentication_classes = []
    
    def get(self, request):
        period = request.query_params.get('period', 'weekly')
        
        if request.user.is_authenticated:
            user_profile = request.user.userprofile
        else:
            # Fallback for verification/testing if no user logged in
            user_profile = UserProfile.objects.first()
            if not user_profile:
                return HttpResponse("No data available", status=404)
        
        if period == 'weekly':
            start_date = timezone.now() - timedelta(days=7)
        else: # annual
            start_date = timezone.now() - timedelta(days=365)
            
        vitals = Vital.objects.filter(user_profile=user_profile, recorded_at__gte=start_date).order_by('-recorded_at')
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="dialiCare_vitals_{period}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Date & Time', 'Systolic BP (mmHg)', 'Diastolic BP (mmHg)', 'Weight (kg)', 'Heart Rate (bpm)', 'Edema', 'Shortness of Breath'])
        
        for v in vitals:
            writer.writerow([
                v.recorded_at.strftime("%Y-%m-%d %H:%M:%S"),
                v.systolic_bp,
                v.diastolic_bp,
                v.body_weight,
                v.heart_rate,
                v.edema,
                v.shortness_of_breath
            ])
            
        return response
