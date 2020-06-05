from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from .serializers import PaperSerializer
from .models import Paper

import math

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def catalog_search(request, *args, **kwargs):
    max_for_page = 5
    if request.GET.get('q', None) and request.GET.get('page', None):
        min_page = max_for_page*int(request.GET.get('page', None)) - max_for_page
        max_page = max_for_page*int(request.GET.get('page', None)) 

        num_papers = Paper.objects.count()
        num_max_pages = math.ceil(num_papers/max_for_page)
        paginator = {
            'total_obj': num_papers,
            'num_max_pages': num_max_pages
        }
        print(num_max_pages)

        papers = Paper.objects.all().order_by('-id')[min_page:max_page]
        serializer_class = PaperSerializer(papers, many=True)
        
        #print(request.GET.get('q', None))
        #print(request.GET.get('page', None))
        return Response(data={'papers': serializer_class.data, 'paginator': paginator}, status=status.HTTP_200_OK)
    else:
        return Response(data="Invalid search query!", status=status.HTTP_401_UNAUTHORIZED)