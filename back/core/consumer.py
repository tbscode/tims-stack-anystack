from channels.generic.websocket import AsyncWebsocketConsumer
import json
from core.models import ConsumerConnections
from asgiref.sync import sync_to_async


class CoreConsumer(AsyncWebsocketConsumer):

    async def connect(self, **kwargs):

        if self.scope["user"].is_anonymous:
            # only allow already authenticated users
            await self.close()
        else:
            print("USERNAME", self.scope["user"].username, flush=True)
            print("CHANNEL_NAME", self.channel_name, flush=True)
            user = self.scope["user"]
            connection = await sync_to_async(ConsumerConnections.get_or_create)(user)
            # we always create the connection group, this is used to broadcast messages to all connected consumers
            await self.channel_layer.group_add(str(connection.uuid), self.channel_name)
            await sync_to_async(connection.connect_device)(self.channel_name)
            await self.accept()

    async def receive(self, text_data):
        if self.scope["user"].is_anonymous:
            # only allow already authenticated users
            await self.close()
        else:
            print("RECEIVED MESSAGE", text_data)
            pass  # TODO ...
        
    
    async def broadcast_message(self, event):
        print("BROADCASET", event, flush=True)
        # Is used to relay message to specific groups, only authenticated users can send anything here!
        if self.scope["user"].is_anonymous:
            # only allow already authenticated users
            await self.close()
        else:
            # TODO: handle different 'event' types
            await self.send(text_data=json.dumps({
                # as convention 'data' should always contain a 'event'
                **event['data'],
            }))

    async def disconnect(self, close_code):

        if self.scope["user"].is_anonymous:
            # only allow already authenticated users :D
            await self.close()
        else:
            user = self.scope["user"]
            
            connection = await sync_to_async(ConsumerConnections.get_or_create)(user, escalate=True)
            await sync_to_async(connection.disconnect_device)(self.channel_name)
            await self.close()
