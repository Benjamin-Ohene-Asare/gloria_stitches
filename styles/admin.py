from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Style


@admin.register(Style)
class StyleAdmin(admin.ModelAdmin):
    list_display = ("title", "code", "category", "fabric", "type", "badge", "created_at")
    search_fields = ("title", "code", "fabric", "type")
    list_filter = ("category", "badge", "fabric", "type")