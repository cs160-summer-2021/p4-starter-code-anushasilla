from django.shortcuts import render

# Create your views here.


def large_ranked(request):
    return render(request, 'map/large_ranked.html')

def large_not_ranked(request):
    return render(request, 'map/large_not_ranked.html')

def small(request):
    return render(request, 'map/small.html')