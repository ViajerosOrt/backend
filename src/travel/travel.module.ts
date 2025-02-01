import { forwardRef, Module } from '@nestjs/common';
import { TravelService } from './travel.service';
import { TravelResolver } from './travel.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { UsersModule } from '../users/users.module';
import { LocationModule } from '../location/location.module';
import { ActivityModule } from '../activity/activity.module';
import { ChecklistModule } from '../checklist/checklist.module';
import { TravelTransformer } from './travel.transformer';
import { TransportModule } from '../transport/transport.module';
import { ChatModule } from '../chat/chat.module';
import { GatewayModule } from '../gateway/gateway.module';
import { MyGateway } from '../gateway/gateway';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Travel]),
    UsersModule,
    ActivityModule,
    LocationModule, 
    ChecklistModule,
    TransportModule,
    ChatModule,
    GatewayModule,
    forwardRef(() => ReviewModule)
  ],
  providers: [TravelResolver, TravelService, TravelTransformer],
  exports: [TravelService],
})
export class TravelModule {}
