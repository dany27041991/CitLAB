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
def ncbi_scraping(request, *args, **kwargs):
    if request.GET.get('q', None) and request.GET.get('page', None):
        return Response(data='Successfully!', status=status.HTTP_200_OK)
    else:
        return Response(data="A problem occurred!", status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def catalog_search(request, *args, **kwargs):
    max_for_page = 5
    if request.GET.get('q', None) and request.GET.get('page', None):
        min_page = max_for_page*int(request.GET.get('page', None)) - max_for_page
        max_page = max_for_page*int(request.GET.get('page', None))

        num_papers = Paper.objects.count()
        num_max_pages = math.ceil(num_papers/max_for_page)

        if int(request.GET.get('page', None)) > num_max_pages:
            paginator = {
                'total': num_papers,
                'num_max_pages': num_max_pages,
                'items_per_page': max_for_page,
                'current_page': num_max_pages
            }

            min_page = max_for_page*num_max_pages - max_for_page
            max_page = max_for_page*num_max_pages

            papers = Paper.objects.all().order_by('-id')[min_page:max_page]
            serializer_class = PaperSerializer(papers, many=True)
        else:    
            paginator = {
                'total': num_papers,
                'num_max_pages': num_max_pages,
                'items_per_page': max_for_page,
                'current_page': request.GET.get('page', None)
            }
            papers = Paper.objects.all().order_by('-id')[min_page:max_page]
            serializer_class = PaperSerializer(papers, many=True)
        
        return Response(data={'papers': serializer_class.data, 'paginator': paginator}, status=status.HTTP_200_OK)
    else:
        return Response(data="Invalid search query!", status=status.HTTP_401_UNAUTHORIZED)

tree = []
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doc_tree(request, id):
    global tree
    tree = []
    paper = Paper.objects.get(pk=id)
    serializer_class = PaperSerializer(paper)
    dirty_tree = iterate(serializer_class.data)
    clear_tree = remove_dupes(dirty_tree)
    print(len(clear_tree))
    return Response(data=dirty_tree, status=status.HTTP_200_OK)

def iterate(object, parent_id=None):
    global tree
    if parent_id is None:
        obj = {
            "guid": "",
            "displayName": "",
            "children": []
        }
    else:
        obj = {
            "guid": "",
            "displayName": "",
            "parentId": parent_id,
            "children": []
        }
    for key, item in object.items():
            if key is 'id':
                obj['guid'] = item
            elif key is 'title':
                obj['displayName'] = item
            elif key is 'mentioned_in':
                child = []
                size = len(item)
                for i in range(size):
                    child.append(item[i]['id'])

                obj['children'] = child
                tree.append(obj)

                for i in range(size):
                    iterate(item[i],obj['guid'])
    return tree

def remove_dupes(mylist):
    newlist = [mylist[0]]
    for e in mylist:
        if e not in newlist:
            newlist.append(e)
    return newlist