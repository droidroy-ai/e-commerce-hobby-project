from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import ProductSerializer, OrderSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_order_items(request):
    """"""
    user = request.user
    data = request.data
    order_items = data['orderItems']

    if order_items and len(order_items) == 0:
        return Response({'details': 'No order items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # (1) Create Order
        order = Order.objects.create(
           user=user,
           paymentMethod=data['paymentMethod'] ,
           taxPrice=data['taxPrice'],
           shippingPrice=data['shippingPrice'],
           totalPrice=data['totalPrice'],
        )

        # (2) Create Shipping Address
        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country']
        )

        # (3) Create order items and set order to the order_item relationship
        for item in order_items:
            product = Product.objects.get(_id=item['product'])
            order_item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=item['qty'],
                price=item['price'],
                image=product.image.url
            )

            # (4) Update the Product stock
            product.countInStock -= order_item.qty
            product.save()
        
    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)