from django.contrib import admin
from .models import Role, UserProfile, Doctor

# Register your models here.
@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    list_filter = ['name']
    search_fields = ['name']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role']
    list_filter = ['role']
    search_fields = ['user', 'role', 'bio']

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['user_profile', 'specialty', 'license_number', 'charge_per_hour']
    list_filter = ['specialty']
    search_fields = ['user_profile', 'specialty', 'licence_number']

