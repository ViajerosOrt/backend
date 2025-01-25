import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { MessageModule } from '../message/message.module';
import { GptModule } from '../GPT/gpt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), MessageModule, GptModule],
  providers: [ChatResolver, ChatService],
  exports: [ChatService],

})
export class ChatModule {}
