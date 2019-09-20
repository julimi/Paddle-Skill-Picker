from django.conf.urls import url
from django.contrib import admin

from .views import (
    UserCreateAPIView,
    UserLoginAPIView,
    UserListAPIView,
    UserDetailAPIView,
    ProfileUpdateAPIView
)

urlpatterns = [
    url(r'^login/$', UserLoginAPIView.as_view(), name='login'),
    url(r'^register/$', UserCreateAPIView.as_view(), name='register'),
    url(r'^(?P<id>\d+)/$', UserDetailAPIView.as_view(), name='user_detail'),
    url(r'^(?P<id>\d+)/addskill/$', ProfileUpdateAPIView.as_view(), name='add_skill'),
    url(r'', UserListAPIView.as_view(), name='user_list'),
]