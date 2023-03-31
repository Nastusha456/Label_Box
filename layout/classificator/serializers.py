from rest_framework import serializers
from rest_framework.views import APIView
from classificator.models import APIClasses, APILables, APIGroups
from rest_framework.response import Response

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIClasses
        fields = ("id", "title",  "code", "lables", "groups")


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = APILables
        fields = ("id", "title",  "code", "type", "mask")


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIGroups
        fields = '__all__'
        

class CombinedSerializer(serializers.Serializer):
    Class = ClassSerializer(many=True)
    Groups = GroupSerializer(many=True)
    Labels = LabelSerializer(many=True)

    def to_representation(self, instance):
        Class = instance['Class']
        Groups = instance['Groups']
        return {
            'Class': ClassSerializer(Class, many=True).data,
            'Groups': GroupSerializer(Groups, many=True).data,
            #'Labels': LabelSerializer(Labels, )
        }
    
class CombinedAPIView(APIView):
    def get(self, request):
        Classes = APIClasses.objects.all()
        Groups = APIGroups.objects.all()

        serializer = CombinedSerializer({"classes": Classes, "groups": Groups})
        return Response(serializer.data)