from django.urls import path

from . import views

app_name = 'api'

urlpatterns = [
    path('', views.apiOverview, name='api-overview'),
    path('task-list/', views.task_list, name='task-list'),
    path('task-detail/<int:pk>/', views.task_detail, name='task-detail'),
    path('task-update/<int:pk>/', views.task_update, name='task-update'),
    path('task-delete/<int:pk>/', views.task_delete, name='task-delete'),
    path('task-create/', views.task_create, name='task-create'),
]
