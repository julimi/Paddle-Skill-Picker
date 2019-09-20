import json
from django.contrib.auth import get_user_model
from django.db.models import Q 
from rest_framework.serializers import (
    ReadOnlyField,
    CharField,
    EmailField,
    ModelSerializer,
    HyperlinkedIdentityField,
    ValidationError
)
from rest_framework_simplejwt.tokens import RefreshToken
from skill.api.serializers import SkillDetailSerializer
from user.models import Profile
from skill.models import Skill
User = get_user_model()

def _get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
}

# Register
class UserCreateSerializer(ModelSerializer):
    email = EmailField(label="Email Address")
    email2 = EmailField(label="Confirm Email", write_only=True)
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'email2',
            'password',
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data['email']
        password = validated_data['password']
        user_obj = User(username=username, email=email)
        user_obj.set_password(password)
        user_obj.save()
        return validated_data

    def validate_email(self, value):
        data = self.get_initial()
        email2 = data.get("email2")
        email1 = value
        if email1 != email2:
            raise ValidationError("Emails Address must match!")
        
        user_query_set = User.objects.filter(email=email1)
        if user_query_set.exists():
            raise ValidationError(f"This Email {email1} has already registered!")
        return value

    def validate_email2(self, value):
        data = self.get_initial()
        email1 = data.get("email")
        email2 = value
        if email1 != email2:
            raise ValidationError("Emails Address must match!")
        return value

# list all users
class UserListSerializer(ModelSerializer):
    url = HyperlinkedIdentityField(
        view_name='user-api:user_detail',
        lookup_field='id'
    )
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'url'
        ]

# each user's detail
class UserDetailSerializer(ModelSerializer):
    username = ReadOnlyField(source='user.username')
    email = ReadOnlyField(source='user.email')
    skills = SkillDetailSerializer(read_only=True, many=True)
    class Meta:
        model = Profile
        fields = [
            'username',
            'email',
            'skills'
        ]

# Login
class UserLoginSerializer(ModelSerializer):
    token = CharField(allow_blank=True, read_only=True)
    username_or_email = CharField(label="Username/Email", write_only=True)
    email = EmailField(read_only=True)
    username = CharField(read_only=True)
    skills = SkillDetailSerializer(read_only=True, many=True)
    class Meta:
        model = User
        fields = [
            'id',
            'username_or_email',
            'username',
            'email',
            'password',
            'token',
            'skills'
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, data):
        username_or_email = data.get('username_or_email', None)
        password = data['password']
        if not username_or_email:
            raise ValidationError("A username or email is required to login!")
        
        user_obj = None
        user = User.objects.filter(
                Q(username=username_or_email) | Q(email=username_or_email)
                ).distinct().exclude(email__isnull=True).exclude(email__iexact='')
        if user.exists() and user.count() == 1:
            user_obj = user.first()
        else:
            raise ValidationError(f"The username/email {username_or_email} does not exists!")

        if user_obj:
            if not user_obj.check_password(password):
                raise ValidationError("Incorrect credentials, please retry.")
        profile_obj = None
        profile = Profile.objects.filter(id=user_obj.id)
        if profile.exists():
            profile_obj = profile.first()
        # after all validation, give it the necessary fields
        data["token"] = _get_tokens_for_user(user_obj)['access']
        data["email"] = user_obj.email
        data["username"] = user_obj.username
        data["id"] = user_obj.id
        data["skills"] = profile_obj.skills
        return data


# add skills
class ProfileUpdateSerializer(ModelSerializer):
    username = ReadOnlyField(source='user.username')
    email = ReadOnlyField(source='user.email')
    skill_objs = []
    skills = SkillDetailSerializer(read_only=True, many=True)
    titles = CharField(write_only=True, required=False, allow_blank=True)
    class Meta:
        model = Profile
        fields = [
            'id',
            'username',
            'email',
            'skills',
            'titles'
        ]

    def validate(self, data):
        titles = data.get('titles', '[]')
        titles = json.loads(titles)
        self.skill_objs = []
        for title in titles:
            skill = Skill.objects.filter(title=title)
            if skill.exists() and skill.count() == 1:
                self.skill_objs.append(skill.first())
            else:
                raise ValidationError(f"The skill {title} does not exists!")
        return data

    def update(self, instance, validated_data):
        for skill in self.skill_objs:
            instance.skills.add(skill)
        instance.save()
        return instance
