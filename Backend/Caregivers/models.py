from django.db import models
from Authentication.models import UserProfile


# Create your models here.
class Caregiver (models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
    ]
    caregiver = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='patients', null=True, blank=True)
    patient = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='caregivers')
    email = models.EmailField()
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    relationship_with_patient = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    class Meta:
        unique_together = ['patient', 'email']

    def __str__(self):
        caregiver_name = self.caregiver.user.username if self.caregiver else self.email
        return f"{caregiver_name} → {self.patient.user.username} ({self.relationship_with_patient}) - {self.status}"
