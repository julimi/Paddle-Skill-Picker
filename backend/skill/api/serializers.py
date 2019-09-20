from rest_framework.serializers import (
    HyperlinkedIdentityField,
    ModelSerializer,
    ValidationError
)

from skill.models import Skill

class SkillListSerializer(ModelSerializer):
    url = HyperlinkedIdentityField(
        view_name='skill-api:skill_detail',
        lookup_field='id'
    )
    class Meta:
        model = Skill
        fields = [
            'id',
            'title',
            'url'
        ]

class SkillDetailSerializer(ModelSerializer):
    class Meta:
        model = Skill
        fields = [
            'id',
            'title'
        ]

# can be used to add the customized skill feature...
class SkillCreateSerializer(ModelSerializer):
    class Meta:
        model = Skill
        fields = [
            'id',
            'title',
        ]

    def create(self, validated_data):
        title = validated_data['title']
        skill_obj = Skill(title=title)
        skill_obj.save()
        return validated_data

    def validate_title(self, value):
        skill_query_set = Skill.objects.filter(title=value)
        if skill_query_set.exists():
            raise ValidationError(f"The skill of {value} has already existed!")
        return value