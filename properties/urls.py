from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('property/<slug:slug>/', views.property_detail, name='property_detail'),
    path('property/id/<int:property_id>/', views.property_detail_legacy, name='property_detail_legacy'),
    path('about/', views.about_page, name='about'),
    path('contact/', views.contact_page, name='contact'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('dashboard/settings/', views.update_site_settings, name='update_site_settings'),
    path('dashboard/add/', views.add_property, name='add_property'),
    path('dashboard/edit/<int:property_id>/', views.edit_property, name='edit_property'),
    path('dashboard/delete/<int:property_id>/', views.delete_property, name='delete_property'),
    path('dashboard/image/delete/<int:image_id>/', views.delete_property_image, name='delete_property_image'),
    path('dashboard/message/<int:message_id>/read/', views.mark_message_read, name='mark_message_read'),
    path('send-message/', views.send_message, name='send_message'),
]
