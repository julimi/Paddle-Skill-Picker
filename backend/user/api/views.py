from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView
from rest_framework.filters import (
    SearchFilter,
    OrderingFilter,
)
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView
)
from rest_framework.permissions import AllowAny
from .serializers import (
    UserCreateSerializer,
    UserLoginSerializer,
    UserListSerializer,
    UserDetailSerializer,
    ProfileUpdateSerializer
)
User = get_user_model()
from user.models import Profile

class UserCreateAPIView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserCreateSerializer
    queryset = User.objects.all()

class UserLoginAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kargs):
        data = request.data
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            new_data = serializer.data
            return Response(new_data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

class UserListAPIView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    # permission_classes = [AllowAny]
    filter_backends= [SearchFilter, OrderingFilter]
    search_fields = ['username']

class UserDetailAPIView(RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserDetailSerializer
    # permission_classes = [AllowAny]
    lookup_field = 'id'

class ProfileUpdateAPIView(RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileUpdateSerializer
    # permission_classes = [AllowAny]
    lookup_field = 'id'