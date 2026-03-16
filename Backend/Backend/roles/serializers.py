from Authentication.models import Role
from rest_framework import serializers


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']