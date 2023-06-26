from django.db import models
from django.utils.translation import pgettext_lazy
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
import concurrent.futures
from asgiref.sync import sync_to_async, async_to_sync
import base64
from uuid import uuid4
from channels.layers import get_channel_layer
from rest_framework import serializers
import random


class UserManager(BaseUserManager):
    def create(self, password, **kwargs):
        user = self.model(
            **kwargs,
        )

        user.set_password(password)
        user.save(using=self._db)
        profile = UserProfile.objects.create(user=user)
        settings = UserSetting.objects.create(user=user)
        user.profile = profile
        user.settings = settings
        user.save()
        return user

    def create_superuser(self, password, **kwargs):
        kwargs["is_staff"] = True
        kwargs["is_superuser"] = True

        user = self.create(password, **kwargs)
        return user


class User(AbstractUser):
    objects = UserManager()

    uuid = models.UUIDField(default=uuid4, editable=False, unique=True)

    profile = models.OneToOneField(
        'UserProfile', on_delete=models.CASCADE, related_name="user_profile", null=True)
    settings = models.OneToOneField(
        'UserSetting', on_delete=models.CASCADE, related_name="user_settings", null=True)



class UserProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_profile_user")
    first_name = models.CharField(max_length=50)
    second_name = models.CharField(max_length=50)
    image = models.TextField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        print("TBS SAVE CALLED")
        super(UserProfile, self).save(*args, **kwargs)
        ConsumerConnections.notify_connections(
            self.user, 
            event="reduction",
            payload={
                "action": "USER_PROFILE",
                "payload": UserProfileSerializer(self).data
            }
        )

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['first_name', 'second_name', 'image']


class UserSetting(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_settings_user")
    show_second_name = models.BooleanField(default=False)
    
class ConsumerConnections(models.Model):
    """
    Model is created when a user connects, one model per user.
    This model is only created once and then stays created.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="consumer_connections_user")
    uuid = models.UUIDField(default=uuid4, editable=False, unique=True)
    
    connections = models.ManyToManyField("Connections", related_name="consumer_connections_connections")
    
    @classmethod
    def get_or_create(cls, user, escalate = False):
        active_connections = cls.objects.filter(user=user)
        if active_connections.exists():
            return active_connections.first()
        else:
            if escalate:
                raise Exception("Consumer connection should already exist!")
            return cls.objects.create(user=user)
        
    def connect_device(self, channel_name):
        self.connections.create(user=self.user, channel_name=channel_name)
        
    def disconnect_device(self, channel_name):
        device = self.connections.filter(channel_name=channel_name).first()
        device.update(active=False, time_left=timezone.now())
        self.connections.remove(device)
        self.save()
        
    @classmethod
    def notify_connections(cls, user, event="reduction", payload={}):
        
        consumer_connection = cls.get_or_create(user)
        channel_layer = get_channel_layer()
        
        async_to_sync(channel_layer.group_send)(str(consumer_connection.uuid), {
            "type": "broadcast_message",
            "data": {
                "event": event,
                "payload": payload
            }
        })
        
    def notify_device(self, channel_name):
        pass # TODO: to nofiy a specific user device
    
class Connections(models.Model):
    """
    Model is created for every deveice a user connects with 
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="active_connection_user")
    channel_name = models.CharField(max_length=255)

    active = models.BooleanField(default=True)
    
    time_joined = models.DateTimeField(auto_now_add=True)
    time_left = models.DateTimeField(null=True, blank=True)

class Chat(models.Model):
    
    uuid = models.UUIDField(default=uuid4, editable=False, unique=True)
    
    u1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="u1")
    u2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="u2")
    
class Message(models.Model):
    
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recipient")
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    
    text = models.TextField()