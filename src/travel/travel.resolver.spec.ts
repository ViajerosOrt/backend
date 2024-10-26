import { Test, TestingModule } from '@nestjs/testing';
import { TravelResolver } from './travel.resolver';
import { TravelService } from './travel.service';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';

describe('TravelResolver', () => {
  let resolver: TravelResolver;
  let service: TravelService;

  const mockTravel = {
    id: 1,
    travelTitle: 'Test Travel',
    travelDescription: 'Test Description',
    startDate: new Date(),
    finishDate: new Date(),
    maxCap: 10,
    isEndable: true,
    creatorUserId: 1,
    usersTravelers: [],
    travelActivities: [],
    locationId: 1,
  };


  const mockTravelService = {
    create: jest.fn().mockResolvedValue(mockTravel),
    findAll: jest.fn().mockResolvedValue([mockTravel]),
    findOne: jest.fn().mockResolvedValue(mockTravel),
    update: jest.fn().mockResolvedValue(mockTravel),
    remove: jest.fn().mockResolvedValue(true),
    joinToTravel: jest.fn().mockResolvedValue(mockTravel),
    leaveTravel: jest.fn().mockResolvedValue(mockTravel),
    findAllTravelByUser: jest.fn().mockResolvedValue([mockTravel]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TravelResolver,
        {
          provide: TravelService,
          useValue: mockTravelService,
        },
      ],
    }).compile();

    resolver = module.get<TravelResolver>(TravelResolver);
    service = module.get<TravelService>(TravelService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createTravel', () => {
    it('should create a new travel', async () => {
      const createTravelInput: CreateTravelInput = {
        travelTitle: 'New Travel',
        travelDescription: 'Test Travel',
        startDate: new Date(),
        finishDate: new Date(),
        maxCap: 10,
        isEndable: true,
        creatorUserId: 1,
      };
      const activityIds = [1, 2, 3];

      const createLocationInput = {
        name: 'Test Location',
        state: 'test State',
        address: 'test address',
        longLatPoint: '1245.12345',
      };

      const result = await resolver.createTravel(
        createTravelInput,
        activityIds,
        createLocationInput,
      );
      expect(result).toEqual(mockTravel);
      expect(service.create).toHaveBeenCalledWith(
        createTravelInput,
        activityIds,
        createLocationInput,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of travels', async () => {
      const result = await resolver.findAll();
      expect(result).toEqual([mockTravel]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single travel', async () => {
      const result = await resolver.findOne(1);
      expect(result).toEqual(mockTravel);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('updateTravel', () => {
    it('should update a travel', async () => {
      const updateTravelInput: UpdateTravelInput = {
        id: 1,
        travelTitle: 'Updated Travel',
        travelDescription: 'Updated Description',
        startDate: new Date(),
        finishDate: new Date(),
        maxCap: 10,
        isEndable: true,
        creatorUserId: 1,
      };

      const result = await resolver.updateTravel(updateTravelInput);
      expect(result).toEqual(mockTravel);
      expect(service.update).toHaveBeenCalledWith(1, updateTravelInput);
    });
  });

  describe('removeTravel', () => {
    it('should remove a travel', async () => {
      const result = await resolver.removeTravel(1);
      expect(result).toEqual(true);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
