from rest_framework import serializers
from .models import User


class SignUpSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "fullName",
            "email",
            "phone",
            "password",
            "confirmPassword",
            "role",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirmPassword"]:
            raise serializers.ValidationError(
                {"confirmPassword": "Passwords do not match."}
            )
        return attrs

    def create(self, validated_data):
        full_name = validated_data.pop("fullName")
        validated_data.pop("confirmPassword")

        email = validated_data["email"]
        base_username = email.split("@")[0]
        username = base_username
        count = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{count}"
            count += 1

        user = User(
            username=username,
            full_name=full_name,
            email=email,
            phone=validated_data["phone"],
            role=validated_data.get("role", "customer"),
        )
        user.set_password(validated_data["password"])
        user.save()
        return user