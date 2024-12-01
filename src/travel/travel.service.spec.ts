import { Test, TestingModule } from '@nestjs/testing';
import { TravelService } from '../travel/travel.service';
import { TravelResolver } from '../travel/travel.resolver';
import { LocationModule } from '../location/location.module';
import { ActivityModule } from '../activity/activity.module';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from '../travel/entities/travel.entity';
import { User } from '../users/entities/user.entity';
import { Location } from '../location/entities/location.entity';
import { Activity } from '../activity/activity.entity';
import { ReviewModule } from '../review/review.module';
import { Review } from '../review/entities/review.entity';
import { Checklist } from '../checklist/entities/checklist.entity';
import { Item } from '../item/entities/item.entity';
import { ChecklistModule } from '../checklist/checklist.module';
import { ItemModule } from '../item/item.module';
import { TravelModule } from './travel.module';
import { TravelTransformer } from './travel.transformer';
import { Transport } from 'src/transport/entities/transport.entity';
import { TransportModule } from 'src/transport/transport.module';

describe('TravelService', () => {
  let service: TravelService;
  let resolver: TravelResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'database_viajeros',
          entities: [User,  Activity, Location, Travel, Review, Item, Checklist, Transport],
          synchronize: false,
        }),
        TypeOrmModule.forFeature([Travel]),
        UsersModule,
        ActivityModule,
        LocationModule,
        ReviewModule,
        ChecklistModule,
        ItemModule,
        TransportModule
      ],
      providers: [TravelResolver, TravelService, TravelTransformer],
    }).compile();

    resolver = module.get<TravelResolver>(TravelResolver);
    service = module.get<TravelService>(TravelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  }, 20000); 
  
});
