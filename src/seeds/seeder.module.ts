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
import { ConfigModule } from "@nestjs/config";



@Module({
    
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite', 
            database: 'dtb.sqlite', 
            entities: [Activity, Location, User, Travel],
            synchronize: true, 
          }),
        ConfigModule.forRoot({
            isGlobal: true, 
          }),
        TypeOrmModule.forFeature([Activity, Location, User, Travel]),
        ActivityModule,
        UsersModule,
        LocationModule,
        TravelModule,
        AuthModule
    ],
    providers: [ActivitySeeder, Seeder, UserSeeder, LocationSeeder, TravelSeeder, LocationService, UsersService],
    exports: [ActivitySeeder, Seeder, UserSeeder, LocationSeeder, TravelSeeder, LocationService,UsersService]
})

export class SeederModule {}