from django.db import models
from Authentication.models import UserProfile


# Create your models here.
class Caregiver (models.Model):
    caregiver = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='patients')
    patient = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='caregivers')
    relationship_with_patient = models.CharField(max_length=100)

    class Meta:
        unique_together = ['caregiver', 'patient']

    def __str__(self):
        return f"{self.caregiver.user.username} → {self.patient.user.username} ({self.relationship_with_patient})"