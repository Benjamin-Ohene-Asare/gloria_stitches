from django.urls import path
from .views import StyleListView, StyleCreateView

urlpatterns = [
    path("", StyleListView.as_view(), name="style-list"),
    path("create/", StyleCreateView.as_view(), name="style-create"),
]