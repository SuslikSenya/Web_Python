from django.urls import path
from .views.user_views import create_user, update_user, delete_user, get_users, me_view

urlpatterns = [
    path('create/', create_user),
    path('<int:user_id>/update/', update_user),
    path('<int:user_id>/delete/', delete_user),
    path('', get_users),
    path('me/', me_view),
]
