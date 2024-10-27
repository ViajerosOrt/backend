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

describe('TravelService', () => {
  let service: TravelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Travel, User, Location, Activity, Review],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Travel]),
        UsersModule,
        ActivityModule,
        LocationModule,
        ReviewModule
      ],
      providers: [TravelResolver, TravelService],
    }).compile();

    service = module.get<TravelService>(TravelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  }, 20000); 
  
});
