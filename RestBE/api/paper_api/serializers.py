from rest_framework import serializers
from .models import Paper

class PaperSerializer(serializers.ModelSerializer):
   class Meta:
        model = Paper
        fields = ('title','abstract','type_paper','isbn','issn','publishing_company','doi','pages','site'
        ,'created_on','year','n_citation','n_version','rating','eprint','pdf','picture','added_on','mentioned_in',
        'owns_version','correlated_with','have_category','writers')