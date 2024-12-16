import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActivitySeeder } from "./activity.seeder";
import { LocationSeeder } from "./location.seeder";
import { Seeder } from "./seeder.sevice";
import { Activity } from "../activity/activity.entity";
import {Location} from '../location/entities/location.entity'
import { User } from "../users/entities/user.entity";
import { UserSeeder } from "./user.seeder";
import { Travel } from "../travel/entities/travel.entity";
import { TravelSeeder } from "./travel.seeder";
import { LocationService } from "../location/location.service";
import { UsersService } from "../users/users.service";
import { ActivityModule } from "../activity/activity.module";
import { UsersModule } from "../users/users.module";
import { LocationModule } from "../location/location.module";
import { TravelModule } from "../travel/travel.module";
import { AuthModule } from "../auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ActivityService } from "../activity/activity.service";
import { Review } from "../review/entities/review.entity";
import { ReviewModule } from "../review/review.module";
import { Item } from "../item/entities/item.entity";
import { Checklist } from "../checklist/entities/checklist.entity";
import { ItemModule } from "../item/item.module";
import { ChecklistModule } from "../checklist/checklist.module";
import { ChecklistSeeder } from "./checklist.seeder";
import { ReviewSeeder } from "./review.seeder";
import { Transport } from "../transport/entities/transport.entity";
import { TransportModule } from "../transport/transport.module";
import { TransportSeeder } from "./transport.seeder";
import { Chat } from "../chat/entities/chat.entity";
import { Message } from "../message/entities/message.entity";
import { ChatModule } from "../chat/chat.module";
import { MessageModule } from "../message/message.module";




@Module({
    
    imports: [
      TypeOrmModule.forRootAsync({
        imports:[ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [User, Activity, Location, Travel, Review, Checklist, Item, Transport, Chat, Message],
          synchronize: false,
        }),
        inject: [ConfigService]
      }),
        ConfigModule.forRoot({
            isGlobal: true, 
          }),
        TypeOrmModule.forFeature([Activity, Location, User, Travel, Review, Item, Checklist, Transport,Chat, Message]),
        ActivityModule,
        UsersModule,
        LocationModule,
        TravelModule,
        AuthModule,
        ReviewModule,
        ItemModule,
        ChecklistModule,
        TransportModule,
        ChatModule,
        MessageModule
    ],
    providers: [ActivitySeeder, Seeder, UserSeeder, LocationSeeder, TravelSeeder, LocationService, UsersService, ActivityService, ChecklistSeeder, ReviewSeeder, TransportSeeder],
    exports: [ActivitySeeder, Seeder, UserSeeder, LocationSeeder, TravelSeeder, LocationService,UsersService, ActivityService, ChecklistSeeder,  ReviewSeeder, TransportSeeder]


})

export class SeederModule {}