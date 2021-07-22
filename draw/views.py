# chat/views.py
from django.shortcuts import render

def index(request):
    size = request.GET.get('size')
    return render(request, 'draw/index.html', {'size': size})

def room(request, room_name):
    return render(request, 'draw/room.html', {
        'room_name': room_name
    })
