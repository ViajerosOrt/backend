import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;

  let mockUser: User = {
    id: "1",
    name: 'Mock Doe',
    email: 'mock@example.com',
    password: '123456789',
    birthDate: new Date('2000-01-01'),
    description: "",
    instagram: 'mockUser',
    whatsapp: '1234',
    userActivities: [],
    travelsCreated: [],
    joinsTravels: [],
    reviewsCreated: [],
    reviewsReceived: [],
    items: [],
  }

  const mockContext = {
    req: {
      user: {
        userId: "1",
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            addActivity: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
  });



  describe('addActivities', () => {
    it('should add activities to a user', async () => {
      const activitiesIds = ["1", "2", "3"];

      const result: User = {
        id: "1",
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        birthDate: new Date('2000-01-01'),
        description: null,
        instagram: 'mockUser',
        whatsapp: '1234',
        userActivities: [],
        travelsCreated: [],
        joinsTravels: [],
        reviewsCreated: [],
        reviewsReceived: [],
        items: [],
      };

      jest.spyOn(service, 'addActivity').mockResolvedValue(result);

      expect(await resolver.addActivities(mockContext, activitiesIds)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const result: User[] = [
        {
          id: "1",
          name: 'John Doe',
          email: 'john@example.com',
          password: '123456',
          birthDate: new Date('2000-01-01'),
          description: null,
          instagram: 'mockUser',
          whatsapp: '1234',
          userActivities: [],
          travelsCreated: [],
          joinsTravels: [],
          reviewsCreated: [],
          reviewsReceived: [],
          items: [],
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.findAll()).toEqual(result);
    });
  });


  describe('findOne', () => {
    it('shoild return a user ', async () => {

      const userId = "1";

      const result: User = {
        id: "1",
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456789',
        birthDate: new Date('2000-01-01'),
        description: null,
        instagram: 'mockUser',
        whatsapp: '1234',
        userActivities: [],
        travelsCreated: [],
        joinsTravels: [],
        reviewsCreated: [],
        reviewsReceived: [],
        items: [],
      }

      jest.spyOn(service, 'findById').mockResolvedValue(result);

      expect(await resolver.findById(userId)).toEqual(result);
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserInput: UpdateUserInput = {
        name: 'Update name',
        password: '987654321',
        description: "des",
        instagram: 'mockUser',
        whatsapp: '1234',
        activitiesIds: []
      };

      const userId = "1";
      jest.spyOn(service, 'update').mockResolvedValue(mockUser);
      const result = await resolver.update(updateUserInput, mockContext);
      expect(result).toEqual(mockUser);
      expect(service.update).toHaveBeenCalledWith(userId, updateUserInput);
    })
  })
});
