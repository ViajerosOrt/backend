import { Test, TestingModule } from '@nestjs/testing';
import { ActivityResolver } from './activity.resolver';
import { ActivityService } from './activity.service';
import { CreateActivityInput } from './dto/create-activity.input';
import { Activity } from './activity.entity';

describe('ActivityResolver', () => {
    let resolver: ActivityResolver;
    let service: ActivityService;

    const mockActivity: Activity = {
        id: "1",
        activityName: 'Mock Activity',
        userActivities: [],
        travelActivities: [],
      };
    
      const mockActivityService = {
        findAll: jest.fn(() => [mockActivity]),
        findActivityById: jest.fn((id: number) => mockActivity),
        createActivity: jest.fn((input: CreateActivityInput) => mockActivity),
      };
    
      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            ActivityResolver,
            {
              provide: ActivityService,
              useValue: mockActivityService,
            },
          ],
        }).compile();
    
        resolver = module.get<ActivityResolver>(ActivityResolver);
        service = module.get<ActivityService>(ActivityService);
      });
    
      it('should be defined', () => {
        expect(resolver).toBeDefined();
      });

      describe('activities', ()=> {
        it('should return an array of activities', async () => {
            const result = await resolver.activities();
            expect(result).toEqual([mockActivity]);
            expect(service.findAll).toHaveBeenCalled();
        })
      })

      describe('activity', () => {
        it('should return a single activity by ID', async () => {
            const userId = "1";
            const result = await resolver.activity(userId);
            expect(result).toEqual(mockActivity);
            expect(service.findActivityById).toHaveBeenCalledWith(userId);
        })
      })

      describe('createActivity', () => {
        it('should create and return a new activity', async () => {
            const createActivityInput: CreateActivityInput ={
                activityName: "new activity",
            }

            const result = await resolver.createActivity(createActivityInput);
            expect(result).toEqual(mockActivity);
            expect(service.createActivity).toHaveBeenCalledWith(createActivityInput);
        })
      })
})
