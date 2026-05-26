from django.db import models

# Create your models here.
from django.db import models


class Style(models.Model):
    CATEGORY_CHOICES = (
        ("women", "Women"),
        ("men", "Men"),
    )

    BADGE_CHOICES = (
        ("New", "New"),
        ("Popular", "Popular"),
        ("Bestseller", "Bestseller"),
    )

    title = models.CharField(max_length=255)
    code = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    fabric = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    badge = models.CharField(max_length=30, choices=BADGE_CHOICES, default="New")
    image = models.ImageField(upload_to="styles/")
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.code})"