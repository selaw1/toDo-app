from django.shortcuts import render


def task_list(request):
    return render(request, 'frontend/list.html')