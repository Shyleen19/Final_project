from django.urls import path
from .views import VitalListCreateView, AdminStatsView, ExportVitalsCSVView

urlpatterns = [
    path('', VitalListCreateView.as_view(), name='list-create-vitals.'),
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('export/', ExportVitalsCSVView.as_view(), name='export-vitals'),
    path('<int:user_id>/', VitalListCreateView.as_view(), name='patient-list-vitals.')
]