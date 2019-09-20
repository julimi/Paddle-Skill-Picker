from django.conf.urls import url
from django.contrib import admin

from .views import (
    SkillCreateAPIView,
    SkillDetailAPIView,
    SkillListAPIView
)

urlpatterns = [
    url(r'^create/$', SkillCreateAPIView.as_view(), name='skill_create'),
    url(r'^(?P<id>\d+)/$', SkillDetailAPIView.as_view(), name='skill_detail'),
    url(r'', SkillListAPIView.as_view(), name='skill_list'),
]