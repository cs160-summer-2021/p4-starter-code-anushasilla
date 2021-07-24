from django.urls import path

from . import views

urlpatterns = [
    path('large/1', views.large_ranked, name='large_ranked'), 
    path('large/2', views.large_not_ranked, name='large_not_ranked'),
    path('small/', views.small, name='large'),
    path('small/water/', views.water, name='water'),
    path('small/study/', views.study, name='study'),
    path('small/restroom/', views.restroom, name='restroom'),

]

# paths are "large/1" and "large/2" to prevent user from prematurely deducing independent variable