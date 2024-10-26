import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { SignupUserInput } from './dto/signup-user.input';
import { User } from '../users/entities/user.entity';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            signup: jest.fn()
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    service = module.get<AuthService>(AuthService);
  });

  describe('signupUser', () => {
    it('should create a new user and signup', async () => {
      const signupUserInput: SignupUserInput = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456789',
        birthDate: new Date('2000-01-01'),
        description: "",
      };

      const result: User = {
        id: "1",
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        birthDate: new Date('2000-01-01'),
        description: null,
        userActivities: [],
        travelsCreated: [],
        joinsTravels: [],
      };

      jest.spyOn(service, 'signup').mockResolvedValue(result);

      expect(await resolver.signup(signupUserInput)).toEqual(result);
    });
  });
});
