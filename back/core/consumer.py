from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async


class CoreConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        print("CONNECT ATTEMPTED")

        if self.scope["user"].is_anonymous:
            # only allow already authenticated users
            await self.close()
        else:
            print("USERNAME", self.scope["user"].username)
            user = self.scope["user"]

            # TODO

    async def broadcast_message(self, event):
        # Sends a message to *all* random call connected users
        # But it doesn't forward the messsage to the user that has triggered the event
        # e.g.: update amount random users
        if self.scope["user"].is_anonymous:
            # only allow already authenticated users
            await self.close()
        else:
            await self.send(text_data=json.dumps({
                # as convention 'data' should always contain a 'event'
                **event['data'],
            }))

    async def receive(self, text_data):
        if self.scope["user"].is_anonymous:
            # only allow already authenticated users
            await self.close()
        else:
            print("RECEIVED MESSAGE", text_data)
            pass  # TODO ...

    async def disconnect(self, close_code):

        if self.scope["user"].is_anonymous:
            # only allow already authenticated users :D
            await self.close()
        else:
            user = self.scope["user"]

            # TODO ...
