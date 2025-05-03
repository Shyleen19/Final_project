from django.db import models
from Authentication.models import UserProfile

class Vital(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    systolic_bp = models.DecimalField(max_digits=5, decimal_places=2)
    diastolic_bp = models.DecimalField(max_digits=5, decimal_places=2)
    blood_oxygen = models.IntegerField()
    heart_rate = models.IntegerField()
    temperature = models.DecimalField(max_digits=4, decimal_places=1)
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_profile.user.first_name} -> HR: {self.heart_rate} bpm"
