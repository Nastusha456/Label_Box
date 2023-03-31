from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from classificator.models import APIClasses, APIGroups, APILables
from .serializers import ClassSerializer, GroupSerializer, LabelSerializer

# Create your views here.

class TotalAPIView(APIView):
    def get(self, request):
        class_result = APIClasses.objects.all()
        groups_result = APIGroups.objects.all()
        labels_result = APILables.objects.all()

        Class_serializer = ClassSerializer(class_result, many=True).data
        Group_serializer = GroupSerializer(groups_result, many=True).data
        Label_serializer = LabelSerializer(labels_result, many=True).data

        data = {
            "groups": Group_serializer,
            "classes": Class_serializer,
            "labels": Label_serializer,
        }
        return Response(data)

# class ClassAPIView(generics.ListAPIView):
#     queryset = APIClasses.objects.all() #, APILables.objects.all(), APIGroups.objects.all()}
#     serializer_class = ClassSerializer


# class GroupsAPIView(generics.ListAPIView):
#     queryset = APIGroups.objects.all()
#     serializer_class = GroupSerializer


# class LabelAPIView(generics.ListAPIView):
#     queryset = APILables.objects.all()
#     serializer_class = LabelSerializer