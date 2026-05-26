from rest_framework import serializers
from .models import Style


class StyleSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Style
        fields = [
            "id",
            "title",
            "code",
            "category",
            "fabric",
            "type",
            "badge",
            "image",
            "description",
            "created_at",
            "updated_at",
        ]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        if obj.image:
            return obj.image.url
        return None


class StyleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Style
        fields = [
            "id",
            "title",
            "code",
            "category",
            "fabric",
            "type",
            "badge",
            "image",
            "description",
        ]

    def validate_code(self, value):
        if Style.objects.filter(code__iexact=value).exists():
            raise serializers.ValidationError("A style with this code already exists.")
        return value