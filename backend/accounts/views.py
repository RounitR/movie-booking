from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.utils import extend_schema, OpenApiExample

class SignupView(APIView):
    """
    POST /signup
    Body: { "username": "...", "password": "...", "email": "..." }
    """

    @extend_schema(
        tags=["Accounts"],
        summary="User signup",
        auth=None,
        examples=[
            OpenApiExample(
                "Signup payload",
                value={"username": "john", "password": "StrongPass123!", "email": "john@example.com"},
                request_only=True,
            )
        ],
    )
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")

        if not username or not password:
            return Response({"detail": "username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"detail": "username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(password)
        except ValidationError as e:
            return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, email=email or "")
        return Response({"id": user.id, "username": user.username, "email": user.email}, status=status.HTTP_201_CREATED)

class LoginView(TokenObtainPairView):
    @extend_schema(
        tags=["Accounts"],
        summary="User login (JWT token obtain)",
        auth=None,
        examples=[
            OpenApiExample(
                "Login payload",
                value={"username": "john", "password": "StrongPass123!"},
                request_only=True,
            )
        ],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class RefreshView(TokenRefreshView):
    @extend_schema(
        tags=["Accounts"],
        summary="Refresh JWT access token",
        auth=None,
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
