from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    ref_photo = serializers.SerializerMethodField()
    receipt_file = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "full_name",
            "phone",
            "whatsapp",
            "location",
            "city",
            "gender",
            "style_name",
            "style_code",
            "style_id_from_catalog",
            "is_custom",
            "fabric",
            "color",
            "color_note",
            "ref_photo",
            "selected_image_url",
            "selected_tag",
            "shoulder",
            "sleeve",
            "bust",
            "waist",
            "hips",
            "dress_length",
            "neck_f",
            "chest",
            "waist_m",
            "trouser",
            "thigh",
            "neck_m",
            "urgency",
            "delivery_date",
            "notes",
            "deposit_amount",
            "payment_method",
            "receipt_file",
            "status",
            "admin_note",
            "created_at",
            "updated_at",
        ]

    def get_ref_photo(self, obj):
        request = self.context.get("request")
        if obj.ref_photo and request:
            return request.build_absolute_uri(obj.ref_photo.url)
        if obj.ref_photo:
            return obj.ref_photo.url
        return None

    def get_receipt_file(self, obj):
        request = self.context.get("request")
        if obj.receipt_file and request:
            return request.build_absolute_uri(obj.receipt_file.url)
        if obj.receipt_file:
            return obj.receipt_file.url
        return None


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "full_name",
            "phone",
            "whatsapp",
            "location",
            "city",
            "gender",
            "style_name",
            "style_code",
            "style_id_from_catalog",
            "is_custom",
            "fabric",
            "color",
            "color_note",
            "ref_photo",
            "selected_image_url",
            "selected_tag",
            "shoulder",
            "sleeve",
            "bust",
            "waist",
            "hips",
            "dress_length",
            "neck_f",
            "chest",
            "waist_m",
            "trouser",
            "thigh",
            "neck_m",
            "urgency",
            "delivery_date",
            "notes",
            "deposit_amount",
            "payment_method",
            "receipt_file",
        ]

    def validate(self, attrs):
        gender = attrs.get("gender")
        style_name = attrs.get("style_name", "")
        is_custom = attrs.get("is_custom", False)
        ref_photo = attrs.get("ref_photo")

        if not attrs.get("full_name", "").strip():
            raise serializers.ValidationError({"full_name": "Full name is required."})

        if not attrs.get("phone", "").strip():
            raise serializers.ValidationError({"phone": "Phone number is required."})

        if not attrs.get("location", "").strip():
            raise serializers.ValidationError({"location": "Location is required."})

        if not attrs.get("city", "").strip():
            raise serializers.ValidationError({"city": "City is required."})

        if not gender:
            raise serializers.ValidationError({"gender": "Gender is required."})

        if not attrs.get("style_name", "").strip():
            raise serializers.ValidationError({"style_name": "Style is required."})

        if not attrs.get("fabric", "").strip():
            raise serializers.ValidationError({"fabric": "Fabric is required."})

        if not attrs.get("color", "").strip():
            raise serializers.ValidationError({"color": "Colour is required."})

        style_is_custom = is_custom or style_name == "Custom / Other"
        if style_is_custom and not ref_photo:
            raise serializers.ValidationError(
                {"ref_photo": "Reference photo is required for custom styles."}
            )

        if gender == "Women":
            required_fields = ["shoulder", "sleeve", "bust", "waist", "hips", "dress_length"]
            for field in required_fields:
                if not attrs.get(field):
                    raise serializers.ValidationError({field: "This field is required."})

        if gender == "Men":
            required_fields = ["shoulder", "sleeve", "chest", "waist_m", "trouser"]
            for field in required_fields:
                if not attrs.get(field):
                    raise serializers.ValidationError({field: "This field is required."})

        if not attrs.get("urgency"):
            raise serializers.ValidationError({"urgency": "Urgency is required."})

        if not attrs.get("delivery_date"):
            raise serializers.ValidationError({"delivery_date": "Delivery date is required."})

        if not attrs.get("deposit_amount"):
            raise serializers.ValidationError({"deposit_amount": "Deposit amount is required."})

        if not attrs.get("payment_method"):
            raise serializers.ValidationError({"payment_method": "Payment method is required."})

        return attrs