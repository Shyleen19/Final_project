from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Role(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    profile_pic = models.ImageField(upload_to='profile_pictures/', default='profile_pictures/default.png')
    phone_number = models.CharField(max_length=10, blank=True)
    address = models.CharField(max_length=255, blank=True)
    bio = models.TextField(default="No bio provided")
    gender = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.user.username
    


class Doctor(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    speciality= models.CharField(max_length=100)
    license_number = models.CharField(max_length=100)
    charge_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    available_days = models.CharField(max_length=100, default="Mon-Fri")
    available_from = models.TimeField(default="08:00")
    available_to = models.TimeField(default="17:00")

    def __str__(self):
        return f"{self.profile.user.username} - {self.speciality}"
    

class Patient(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    emergency_contact = models.CharField(max_length=100, blank=True)
    chronic_conditions = models.TextField(blank=True)


    def __str__(self):
        return self.profile.user.username
    


class Caregiver(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    relationship_to_patient = models.TextField(blank=True)

    def __str__(self):
        return self.profile.user.username


