import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, Socket>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedClients.set(userId, client);
      console.log(`Client connected: ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedClients.delete(userId);
      console.log(`Client disconnected: ${userId}`);
    }
  }

  joinRoom(userId: string, chatId: string, userName: string) {
    const client = this.connectedClients.get(userId);
    if (client) {
      this.server.to(chatId).emit('userJoined', { message: `User ${userName} joined the chat.` });
      console.log(`User ${userName} joined room ${chatId}`);
      console.log(client.rooms)
    }
  }
  
  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() body: { chatId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(client.rooms)
    this.server.to(body.chatId).emit('newMessage', { message: body.message });
    console.log(`Message sent to room ${body.chatId}: ${body.message}`);
  }
}
