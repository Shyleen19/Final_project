from django.db import models
from Authentication.models import UserProfile

class Vital(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    systolic_bp = models.DecimalField(max_digits=5, decimal_places=2)
    diastolic_bp = models.DecimalField(max_digits=5, decimal_places=2)
    body_weight = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    heart_rate = models.IntegerField(default=70)
    edema = models.CharField(max_length=20, default='None')
    shortness_of_breath = models.CharField(max_length=20, default='None')
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_profile.user.first_name} -> HR: {self.heart_rate} bpm"
