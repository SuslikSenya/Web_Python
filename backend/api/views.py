# from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from serializers import RegisterSerializer

User = get_user_model()


@api_view(['POST'])
def create_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    return Response({'detail': 'Username is required'}, status=400)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if user != request.user:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    user.username = request.data.get('username', user.username)
    user.email = request.data.get('email', user.email)
    user.save()

    return Response({'message': 'User updated successfully'})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id: int):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if user != request.user:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    current_username = user.username
    user.delete()

    return Response({'message': f'User {current_username} was deleted successful'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    if not request.user.is_superuser:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    users = User.objects.all().values('id', 'username', 'email', 'is_superuser')

    return Response(list(users))
