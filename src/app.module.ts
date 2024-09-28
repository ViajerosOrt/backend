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
import { ConfigModule } from '@nestjs/config';
import { SeederModule } from './seeds/seeder.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'database_viajeros',
      entities: [User,  Activity, Location, Travel],
      synchronize: false,

    }),
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
    }),
    SeederModule,
    ActivityModule,
    UsersModule,
    TravelModule,
    LocationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
