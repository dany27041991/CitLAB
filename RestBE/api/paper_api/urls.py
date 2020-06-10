from django.urls import path, include
from paper_api import views

urlpatterns = [
    path('search/',views.catalog_search),
    path('documents/<int:id>/', views.doc_tree),
]