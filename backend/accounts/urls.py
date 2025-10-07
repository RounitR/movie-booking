from django.urls import path
from .views import SignupView, LoginView, RefreshView

urlpatterns = [
    path('signup', SignupView.as_view(), name='signup'),
    path('login', LoginView.as_view(), name='login'),
    path('token/refresh', RefreshView.as_view(), name='token_refresh'),
]