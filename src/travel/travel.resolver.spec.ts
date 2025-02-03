import { Test, TestingModule } from '@nestjs/testing';
import { TravelResolver } from './travel.resolver';
import { TravelService } from './travel.service';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { TravelTransformer } from './travel.transformer';
import { CreateLocationInput } from '../location/dto/create-location.input';
import { Travel } from './entities/travel.entity';
import { TravelDto } from './dto/travel.dto.reolver';

describe('TravelResolver', () => {
  let resolver: TravelResolver;
  let service: TravelService;
  let transformer: TravelTransformer;

  const userId = '1';

  const mockContext = {
    req: {
      user: {
        userId,
      },
    },
  };

  
  const mockTravelDto = {
    id: '1',
    travelTitle: 'Test Travel',
    travelDescription: 'Test Description',
    startDate: new Date(),
    finishDate: new Date(),
    maxCap: 10,
    isEndable: true,
    country: 'Uruguay',
    creatorUser: { id: '1', name: 'Test User' },
    usersTravelers: [],
    travelActivities: [],
    travelLocation: { id: '1' },
    checklist: null,
    usersCount: 0,
    isJoined: false,
    transport: { id: '1' },
  };
  

  const mockTravelService = {
    create: jest.fn().mockResolvedValue(mockTravelDto),
    findAll: jest.fn().mockResolvedValue([mockTravelDto]),
    findOne: jest.fn().mockResolvedValue(mockTravelDto),
    update: jest.fn().mockResolvedValue(mockTravelDto),
    remove: jest.fn().mockResolvedValue(true),
    joinToTravel: jest.fn().mockResolvedValue(mockTravelDto),
    leaveTravel: jest.fn().mockResolvedValue(mockTravelDto),
    addChecklistToTravel: jest.fn().mockResolvedValue(mockTravelDto),
    addItemToChecklist: jest.fn().mockResolvedValue(mockTravelDto),
    removeItemToChecklist: jest.fn().mockResolvedValue(mockTravelDto),
    assignItemToUser: jest.fn().mockResolvedValue(mockTravelDto),
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
        TravelTransformer,
      ],
    }).compile();

    resolver = module.get<TravelResolver>(TravelResolver);
    service = module.get<TravelService>(TravelService);
    transformer = module.get<TravelTransformer>(TravelTransformer);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createTravel', () => {
    it('should create a new travel and return TravelDto', async () => {
      const createTravelInput: CreateTravelInput = {
        travelTitle: 'New Travel',
        travelDescription: 'Test Travel',
        startDate: new Date(Date.now() + 100000),
        finishDate: new Date(Date.now() + 200000),
        maxCap: 10,
        isEndable: true,
        country: 'Uruguay',
        countryOfOrigin: 'Uruguay',
      };
      const activityIds = ['1', '2', '3'];
      const createLocationInput = {
        name: 'Test Location',
        state: 'test State',
        address: 'test address',
        longLatPoint: '1245.12345',
      };
      const items: string[] = ['pelota', 'silla'];
      const transportId = '1';

      const result = await resolver.createTravel(
        createTravelInput,
        activityIds,
        createLocationInput,
        items,
        transportId,
        mockContext,
      );

      expect(result).toEqual(mockTravelDto);
      expect(service.create).toHaveBeenCalledWith(
        createTravelInput,
        activityIds,
        createLocationInput,
        userId,
        items,
        transportId,
      );
    });
  });

  describe('joinToTravel', () => {
    it('should allow user to join a travel and return TravelDto', async () => {
      const travelId = '1';
      const result = await resolver.joinToTravel(travelId, mockContext);
      expect(result).toEqual(mockTravelDto);
      expect(service.joinToTravel).toHaveBeenCalledWith('1', travelId);
    });
  });

  describe('leaveTravel', () => {
    it('should allow user to leave a travel and return TravelDto', async () => {
      const travelId = '1';
      const result = await resolver.leaveTravel(travelId, mockContext);
      expect(result).toEqual(mockTravelDto);
      expect(service.leaveTravel).toHaveBeenCalledWith('1', travelId);
    });
  });

  describe('addChecklistToTravel', () => {
    it('should add checklist items to travel and return TravelDto', async () => {
      const travelId = '1';
      const items = ['item1', 'item2'];
      const result = await resolver.addChecklistToTravel(
        travelId,
        mockContext,
        items,
      );
      expect(result).toEqual(mockTravelDto);
      expect(service.addChecklistToTravel).toHaveBeenCalledWith(
        travelId,
        '1',
        items,
      );
    });
  });


  describe('assignItemToUser', () => {
    it('should assign an item to a user and return TravelDto', async () => {
      const travelId = '1';
      const itemId = 'item1';
      const result = await resolver.assignItemToUser(
        travelId,
        mockContext,
        itemId,
      );
      expect(result).toEqual(mockTravelDto);
      expect(service.assignItemToUser).toHaveBeenCalledWith(
        travelId,
        '1',
        itemId,
      );
    });
  });

  describe('TravelResolver - findAll', () => {
    it('should return an array of TravelDto with correct filters applied', async () => {
      const mockTravels: TravelDto[] = [
        {
          id: '1',
          travelTitle: 'Test Travel',
          travelDescription: 'Test Description',
          startDate: new Date(),
          finishDate: new Date(),
          maxCap: 10,
          isEndable: true,
          country: 'Test Country',
          usersTravelers: [],
          creatorUser: null,
          travelActivities: [],
          checklist: null,
          travelLocation: null,
          reviews: [],
          isJoined: false,
          usersCount: 0,
          imageUrl: '',
          countryOfOrigin: '',
          transport: null,
          chat: null,
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockTravels);

      expect(await resolver.findAll(mockContext)).toEqual(mockTravels);
    });

    describe('findOne', () => {
      it('should return a single TravelDto', async () => {
        const result = await resolver.findOne('1', mockContext);
        expect(result).toEqual(mockTravelDto);
        expect(service.findOne).toHaveBeenCalledWith('1', '1');
      });
    });

    describe('updateTravel', () => {
      it('should update a travel and return TravelDto', async () => {
        const updateTravelInput: UpdateTravelInput = {
          id: '1',
          travelTitle: 'Updated Travel',
          travelDescription: 'Updated Description',
          startDate: new Date(Date.now() + 100000),
          finishDate: new Date(Date.now() + 200000),
          maxCap: 10,
          isEndable: true,
          country: 'Uruguay',
        };
        const activityIds = ['1', '2', '3'];
        const trasportId = '1';
        const items = ['item1', 'item2'];
        const updateLocationInput: CreateLocationInput = {
          name: 'location',
          state: 'generic',
          address: '1',
          longLatPoint: '1',
        };
        const result = await resolver.updateTravel(
          updateTravelInput,
          mockContext,
          activityIds,
          trasportId,
          items,
          updateLocationInput,
        );
        expect(result).toEqual(mockTravelDto);
        expect(mockTravelService.update).toHaveBeenCalledWith(
          '1',
          updateTravelInput,
          activityIds,
          trasportId,
          items,
          updateLocationInput,
          '1',
        );
      });
    });

    describe('removeTravel', () => {
      it('should remove a travel and return boolean', async () => {
        const result = await resolver.removeTravel('1', mockContext);
        expect(result).toEqual(true);
        expect(service.remove).toHaveBeenCalledWith('1', '1');
      });
    });
  });
});
