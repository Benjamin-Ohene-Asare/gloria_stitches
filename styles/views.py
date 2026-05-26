from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Style
from .permissions import IsAdminRole
from .serializers import StyleSerializer, StyleCreateSerializer


class StyleListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get("category")
        queryset = Style.objects.all()

        if category in ["women", "men"]:
            queryset = queryset.filter(category=category)

        serializer = StyleSerializer(
            queryset,
            many=True,
            context={"request": request},
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


class StyleCreateView(APIView):
    permission_classes = [IsAdminRole]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = StyleCreateSerializer(data=request.data)

        if serializer.is_valid():
            style = serializer.save()
            return Response(
                {
                    "message": "Style posted successfully.",
                    "style": StyleSerializer(
                        style, context={"request": request}
                    ).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)