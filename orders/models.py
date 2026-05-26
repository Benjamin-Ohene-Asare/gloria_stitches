from django.conf import settings
from django.db import models


class Order(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders",
        null=True,
        blank=True,
    )

    GENDER_CHOICES = (
        ("Women", "Women"),
        ("Men", "Men"),
    )

    URGENCY_CHOICES = (
        ("standard", "Standard"),
        ("express", "Express"),
        ("urgent", "Urgent"),
    )

    PAYMENT_METHOD_CHOICES = (
        ("Mobile Money (MoMo)", "Mobile Money (MoMo)"),
        ("Bank Transfer", "Bank Transfer"),
        ("Cash on Delivery", "Cash on Delivery"),
        ("Pay on Pick-up", "Pay on Pick-up"),
    )

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("in_progress", "In Progress"),
        ("ready", "Ready"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    )

    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=30)
    whatsapp = models.CharField(max_length=30, blank=True)
    location = models.CharField(max_length=255)
    city = models.CharField(max_length=100)

    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    style_name = models.CharField(max_length=255)
    style_code = models.CharField(max_length=100, blank=True)
    style_id_from_catalog = models.PositiveIntegerField(null=True, blank=True)
    is_custom = models.BooleanField(default=False)

    fabric = models.CharField(max_length=100)
    color = models.CharField(max_length=100)
    color_note = models.CharField(max_length=255, blank=True)
    ref_photo = models.ImageField(upload_to="orders/reference_photos/", blank=True, null=True)

    selected_image_url = models.URLField(blank=True)
    selected_tag = models.CharField(max_length=100, blank=True)

    shoulder = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    sleeve = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

    bust = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    waist = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    hips = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    dress_length = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    neck_f = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

    chest = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    waist_m = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    trouser = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    thigh = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    neck_m = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, default="standard")
    delivery_date = models.DateField()
    notes = models.TextField(blank=True)

    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES)
    receipt_file = models.FileField(upload_to="orders/receipts/", blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    admin_note = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.id} - {self.full_name} - {self.style_name}"