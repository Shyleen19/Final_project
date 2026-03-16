from django.contrib import admin
from .models import Caregiver

# Register your models here.
@admin.register(Caregiver)
class CaregiverAdmin(admin.ModelAdmin):
    list_display = ['caregiver', 'patient', 'relationship_with_patient']
    list_filter = ['caregiver', 'patient']