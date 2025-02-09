import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path'
import { UsersModule } from './users/users.module';
import { TravelModule } from './travel/travel.module';
import { LocationModule } from './location/location.module';
import { ActivityModule } from './activity/activity.module';
import { User } from './users/entities/user.entity';
import { Travel } from './travel/entities/travel.entity';
import { Activity } from './activity/activity.entity';
import typeorm from './config/typeorm';
import { Location } from './location/entities/location.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeederModule } from './seeds/seeder.module';
import { ChecklistModule } from './checklist/checklist.module';
import { Review } from './review/entities/review.entity';
import { ReviewModule } from './review/review.module';
import { Checklist } from './checklist/entities/checklist.entity';
import { ItemModule } from './item/item.module';
import { Item } from './item/entities/item.entity';
import { GraphQLError } from 'graphql';
import { TransportModule } from './transport/transport.module';
import { Transport } from './transport/entities/transport.entity';
import { GatewayModule } from './gateway/gateway.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { Chat } from './chat/entities/chat.entity';
import { Message } from './message/entities/message.entity';
import { MulterModule } from '@nestjs/platform-express';
import { UploadModule } from './upload/upload.module';
import { GptModule } from './GPT/gpt.module';



@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError = {
          message: error.message,
          path: error.path,
          code: error.extensions.code
        };
        return graphQLFormattedError;
      },
      subscriptions:{
        'graphql-ws':true
      }
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Activity, Location, Travel, Review, Checklist, Item, Transport,Chat, Message],
        synchronize: false,
      }),
      inject: [ConfigService]
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    UploadModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SeederModule,
    ActivityModule,
    UsersModule,
    TravelModule,
    LocationModule,
    AuthModule,
    ChecklistModule,
    ReviewModule,
    ItemModule,
    TransportModule,
    GatewayModule,
    ChatModule,
    MessageModule,
    GptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
