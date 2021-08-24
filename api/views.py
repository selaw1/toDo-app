from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import TaskSerializer
from .models import Task


@api_view (['GET'])
def apiOverview(request):
    api_urls = {
        'List':'/task-list/',
        'Detail':'task-detail/<int:pk>',
        'Create':'task-create/',
        'Update':'task-update/<int:pk>',
        'Delete':'task-delete/<int:pk>',
    }
    return Response(api_urls)

@api_view (['GET'])
def task_list(request):
    tasks = Task.objects.all().order_by('-id')
    task_serializer = TaskSerializer(tasks, many=True)
    return Response(task_serializer.data)

@api_view (['GET'])
def task_detail(request, pk):
    task = get_object_or_404(Task, pk=pk)
    # task = Task.objects.get(id=pk)
    task_serializer = TaskSerializer(instance=task, many=False)
    return Response(task_serializer.data)

@api_view (['GET','PUT'])
def task_update(request, pk):
    task = get_object_or_404(Task, pk=pk)
    # task = Task.objects.get(id=pk)

    if request.method == 'GET':
        task_serializer = TaskSerializer(instance=task, many=False)
        return Response(task_serializer.data)

    if request.method == 'PUT':
        task_serializer = TaskSerializer(instance=task, data=request.data)
        if task_serializer.is_valid():
            task_serializer.save()
            return Response(task_serializer.data)
        return Response(task_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view (['GET','DELETE'])
def task_delete(request, pk):
    task = get_object_or_404(Task, pk=pk)
    # task = Task.objects.get(id=pk)

    if request.method == 'GET':
        task_serializer = TaskSerializer(instance=task, many=False)
        return Response(task_serializer.data)

    if request.method == 'DELETE': 
        message = "Item Deleted"
        task.delete()
        return Response(message, status=status.HTTP_204_NO_CONTENT)

@api_view (['GET','POST'])
def task_create(request):

    if request.method == 'GET':
        tasks = Task.objects.all()
        task_serializer = TaskSerializer(tasks, many=True)
        return Response(task_serializer.data)
    
    if request.method == 'POST':
        task_serializer = TaskSerializer(data=request.data)
        if task_serializer.is_valid():
            task_serializer.save()
            return Response(task_serializer.data, status=status.HTTP_201_CREATED)
        return Response(task_serializer.errors, status=status.HTTP_400_BAD_REQUEST)