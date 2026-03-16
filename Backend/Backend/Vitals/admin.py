from django.contrib import admin
from .models import Vital

@admin.register(Vital)
class VitalAdmin(admin.ModelAdmin):
    list_display = ['user_profile', 'systolic_bp', 'diastolic_bp', 'heart_rate', 'blood_oxygen', 'temperature', 'recorded_at']
    list_filter = ['user_profile', 'recorded_at']
    search_fields = ['user_profile__user__first_name', 'user_profile__user__last_name', 'user_profile__user__email']
