from rest_framework.permissions import AllowAny
from rest_framework.filters import (
    SearchFilter,
    OrderingFilter,
)
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView
)
from skill.models import Skill
from .serializers import (
    SkillListSerializer,
    SkillDetailSerializer,
    SkillCreateSerializer
)


class SkillCreateAPIView(CreateAPIView):
    # AllowAny for test
    # permission_classes = [AllowAny]
    queryset = Skill.objects.all()
    serializer_class = SkillCreateSerializer

class SkillDetailAPIView(RetrieveAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillDetailSerializer
    # permission_classes = [AllowAny]
    lookup_field = 'id'

class SkillListAPIView(ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillListSerializer
    # permission_classes = [AllowAny]
    filter_backends= [SearchFilter, OrderingFilter]
    search_fields = ['title']

