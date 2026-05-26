from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "phone",
        "gender",
        "style_name",
        "is_custom",
        "urgency",
        "delivery_date",
        "deposit_amount",
        "payment_method",
        "status",
        "created_at",
    )
    list_filter = ("gender", "is_custom", "urgency", "payment_method", "status", "created_at")
    search_fields = ("full_name", "phone", "whatsapp", "style_name", "style_code", "city")
    readonly_fields = ("created_at", "updated_at")