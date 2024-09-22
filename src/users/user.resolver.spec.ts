import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;

  let mockUser = {
    id: 1,
    userName: 'Mock Doe',
    email: 'mock@example.com',
    password: '123456789',
    birth_date: new Date('2000-01-01'),
    userDescription: "",
    userActivities: [],
    travelsCreated: [],
    joinsTravels: [],
  }

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
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserInput: CreateUserInput = {
        userName: 'John Doe',
        email: 'john@example.com',
        password: '123456789',
        birth_date: new Date('2000-01-01'),
        userDescription: "",
      };

      const result: User = {
        id: 1,
        userName: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        birth_date: new Date('2000-01-01'),
        userDescription: null,
        userActivities: [],
        travelsCreated: [],
        joinsTravels: [],
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await resolver.createUser(createUserInput)).toEqual(result);
    });
  });

  describe('addActivities', () => {
    it('should add activities to a user', async () => {
      const userId = 1;
      const activitiesIds = [1, 2, 3];
      
      const result: User = {
        id: 1,
        userName: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        birth_date: new Date('2000-01-01'),
        userDescription: null,
        userActivities: [],  
        travelsCreated: [],
        joinsTravels: [],
      };

      jest.spyOn(service, 'addActivity').mockResolvedValue(result);

      expect(await resolver.addActivities(userId, activitiesIds)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const result: User[] = [
        {
          id: 1,
          userName: 'John Doe',
          email: 'john@example.com',
          password: '123456',
          birth_date: new Date('2000-01-01'),
          userDescription: null,
          userActivities: [],
          travelsCreated: [],
          joinsTravels: [],
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.findAll()).toEqual(result);
    });
  });


  describe('findOne', () =>{
    it('shoild return a user ', async () => {

        const userId = 1;

        const result: User = {
            id: 1,
            userName: 'John Doe',
            email: 'john@example.com',
            password: '123456789',
            birth_date: new Date('2000-01-01'),
            userDescription: null,
            userActivities: [],
            travelsCreated: [],
            joinsTravels: [],
        }

        jest.spyOn(service, 'findOne').mockResolvedValue(result);

        expect(await resolver.findOne(userId)).toEqual(result);
    })
  })

  describe('update', () => {
    it('should update a user', async () =>{
      const updateUserInput: UpdateUserInput = {
        userName: 'Update name',
        password: '987654321',
        userDescription: "des"

      };

      const userId = 1; 
      jest.spyOn(service, 'update').mockResolvedValue(mockUser);
      const result = await resolver.update(updateUserInput, userId);
      expect(result).toEqual(mockUser);
      expect(service.update).toHaveBeenCalledWith(userId, updateUserInput);
    })
  })
});
