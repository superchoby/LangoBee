from rest_framework.views import APIView
from rest_framework.response import Response
from djstripe.models import Product

class ProductsView(APIView):
    def get(self, request, language):
        return Response(Product.objects.all())
