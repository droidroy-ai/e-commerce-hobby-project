from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import ProductSerializer, OrderSerializer

from datetime import datetime

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
                image=product.image
            )

            # (4) Update the Product stock
            product.countInStock -= order_item.qty
            product.save()
        
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_orders(request):
    """"""
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_orders(request):
    """"""
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_by_id(request, pk):
    """"""
    user = request.user

    try: 
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'details': 'Not authorized to view this order'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'details': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_to_paid(request, pk):
    """"""
    order = Order.objects.get(_id=pk)
    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response('Order was paid')


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_order_to_delivered(request, pk):
    """"""
    order = Order.objects.get(_id=pk)
    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()

    return Response('Order was delivered')

