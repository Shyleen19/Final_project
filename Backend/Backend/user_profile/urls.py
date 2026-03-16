from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewset, DoctorViewset, PatientViewset, CaregiverViewset

router = DefaultRouter()
router.register('profiles', ProfileViewset)
router.register('doctors', DoctorViewset)
router.register('patients', PatientViewset)
router.register('caregivers', CaregiverViewset)


urlpatterns = [
    path('', include(router.urls))
]