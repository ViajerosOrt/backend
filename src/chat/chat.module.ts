import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
<<<<<<< HEAD
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), MessageModule],
  providers: [ChatResolver, ChatService],
  exports: [ChatService],
=======

@Module({
  providers: [ChatResolver, ChatService],
>>>>>>> bbc90cbcf59be72c96ed6a2a7e28c934c242a184
})
export class ChatModule {}
