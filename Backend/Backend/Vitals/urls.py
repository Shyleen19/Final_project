from django.urls import path
from .views import VitalListCreateView

urlpatterns = [
    path('', VitalListCreateView.as_view(), name='list-create-vitals.'),
    path('<int:user_id>/', VitalListCreateView.as_view(), name='patient-list-vitals.')
]