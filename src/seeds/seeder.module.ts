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
import { ActivityService } from "../activity/activity.service";
import { Review } from "../review/entities/review.entity";
import { ReviewModule } from "../review/review.module";
import { Item } from "../item/entities/item.entity";
import { Checklist } from "../checklist/entities/checklist.entity";
import { ItemModule } from "../item/item.module";
import { ChecklistModule } from "../checklist/checklist.module";
import { ChecklistSeeder } from "./checklist.seeder";
import { ReviewSeeder } from "./review.seeder";




@Module({
    
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'database_viajeros',
        entities: [User,  Activity, Location, Travel, Review, Item, Checklist],
        synchronize: false,
      }),
        ConfigModule.forRoot({
            isGlobal: true, 
          }),
        TypeOrmModule.forFeature([Activity, Location, User, Travel, Review, Item, Checklist]),
        ActivityModule,
        UsersModule,
        LocationModule,
        TravelModule,
        AuthModule,
        ReviewModule,
        ItemModule,
        ChecklistModule
    ],
    providers: [ActivitySeeder, Seeder, UserSeeder, LocationSeeder, TravelSeeder, LocationService, UsersService, ActivityService, ChecklistSeeder, ReviewSeeder],
    exports: [ActivitySeeder, Seeder, UserSeeder, LocationSeeder, TravelSeeder, LocationService,UsersService, ActivityService, ChecklistSeeder,  ReviewSeeder]


})

export class SeederModule {}