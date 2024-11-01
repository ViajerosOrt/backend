import { Test, TestingModule } from '@nestjs/testing';
import { TravelResolver } from './travel.resolver';
import { TravelService } from './travel.service';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';

describe('TravelResolver', () => {
  let resolver: TravelResolver;
  let service: TravelService;

  const mockTravel = {
    id: "1",
    travelTitle: 'Test Travel',
    travelDescription: 'Test Description',
    startDate: new Date(),
    finishDate: new Date(),
    maxCap: 10,
    isEndable: true,
    creatorUser: "1",
    usersTravelers: [],
    travelActivities: [],
    travelLocation: { id: "1" },
    locationId: "1",
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
    addChecklistToTravel: jest.fn().mockResolvedValue(mockTravel),
    addItemToChecklist: jest.fn().mockResolvedValue(mockTravel),
    removeItemToChecklist: jest.fn().mockResolvedValue(mockTravel),
    assignItemToUser: jest.fn().mockResolvedValue(mockTravel),
    bringTotalTravelers: jest.fn().mockResolvedValue(5),
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
        startDate: new Date(Date.now() + 100000),
        finishDate: new Date(Date.now() + 200000),


        maxCap: 10,
        isEndable: true,
      };
      const activityIds = ["1", "2", "3"];
      const createLocationInput = {
        name: 'Test Location',
        state: 'test State',
        address: 'test address',
        longLatPoint: '1245.12345',
      };
  

      const userId = "1";
      
      const items: string[] = ['pelota', 'silla']; 

      const result = await resolver.createTravel(
        createTravelInput,
        userId,
        activityIds,
        createLocationInput,
        items,

      );
      expect(result).toEqual(mockTravel);
      expect(service.create).toHaveBeenCalledWith(
        createTravelInput,
        activityIds,
        createLocationInput,
        userId,
        items

      );
    });
  });

  describe('joinToTravel', () => {
    it('should allow user to join a travel', async () => {
      const travelId = "1";
      const context = { req: { user: { userId: "1" } } };
      const result = await resolver.joinToTravel(travelId, context);
      expect(result).toEqual(mockTravel);
      expect(service.joinToTravel).toHaveBeenCalledWith("1", travelId);
    });
  });

  describe('leaveTravel', () => {
    it('should allow user to leave a travel', async () => {
      const travelId = "1";
      const context = { req: { user: { userId: "1" } } };
      const result = await resolver.leaveTravel(travelId, context);
      expect(result).toEqual(mockTravel);
      expect(service.leaveTravel).toHaveBeenCalledWith("1", travelId);
    });
  });

  describe('addChecklistToTravel', () => {
    it('should add checklist items to travel', async () => {
      const travelId = "1";
      const items = ['item1', 'item2'];
      const context = { req: { user: { userId: "1" } } };
      const result = await resolver.addChecklistToTravel(travelId, context, items);
      expect(result).toEqual(mockTravel);
      expect(service.addChecklistToTravel).toHaveBeenCalledWith(travelId, "1", items);
    });
  });

  describe('addItemsToChecklist', () => {
    it('should add items to checklist', async () => {
      const travelId = "1";
      const items = ['item3'];
      const context = { req: { user: { userId: "1" } } };
      const result = await resolver.addItemsToChecklist(travelId, context, items);
      expect(result).toEqual(mockTravel);
      expect(service.addItemToChecklist).toHaveBeenCalledWith(travelId, "1", items);
    });
  });

  describe('removeItemsToChecklist', () => {
    it('should remove items from checklist', async () => {
      const travelId = "1";
      const items = ['item1'];
      const context = { req: { user: { userId: "1" } } };
      const result = await resolver.removeItemsToChecklist(travelId, context, items);
      expect(result).toEqual(mockTravel);
      expect(service.removeItemToChecklist).toHaveBeenCalledWith(travelId, "1", items);
    });
  });

  describe('assignItemToUser', () => {
    it('should assign an item to a user', async () => {
      const travelId = "1";
      const itemId = 'item1';
      const context = { req: { user: { userId: "1" } } };
      const result = await resolver.assignItemToUser(travelId, context, itemId);
      expect(result).toEqual(mockTravel);
      expect(service.assignItemToUser).toHaveBeenCalledWith(travelId, "1", itemId);
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
      const result = await resolver.findOne("1");
      expect(result).toEqual(mockTravel);
      expect(service.findOne).toHaveBeenCalledWith("1");
    });
  });



  describe('updateTravel', () => {
    it('should update a travel', async () => {
      const updateTravelInput: UpdateTravelInput = {
        id: "1",
        travelTitle: 'Updated Travel',
        travelDescription: 'Updated Description',
        startDate: new Date(Date.now() + 100000),
        finishDate: new Date(Date.now() + 200000),


        maxCap: 10,
        isEndable: true,
      };

      const result = await resolver.updateTravel(updateTravelInput);
      expect(result).toEqual(mockTravel);
      expect(service.update).toHaveBeenCalledWith("1", updateTravelInput);
    });
  });

  describe('removeTravel', () => {
    it('should remove a travel', async () => {
      const result = await resolver.removeTravel("1");
      expect(result).toEqual(true);
      expect(service.remove).toHaveBeenCalledWith("1");
    });
  });

  describe('findAllTravelByUser', () => {
    it('should return all travels by a specific user', async () => {
      const userId = "1";
      const result = await resolver.findAllTravelByUser(userId);
      expect(result).toEqual([mockTravel]);
      expect(service.findAllTravelByUser).toHaveBeenCalledWith(userId);
    });
  });
});
