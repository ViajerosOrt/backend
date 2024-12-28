import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { GatewayModule } from '../gateway/gateway.module';
import { MyGateway } from '../gateway/gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    GatewayModule
  ],
  providers: [MessageResolver, MessageService],
  exports:[MessageService]

})
export class MessageModule {}
