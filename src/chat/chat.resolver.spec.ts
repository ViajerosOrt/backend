import { Test, TestingModule } from '@nestjs/testing';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Chat } from './entities/chat.entity';
import { ExecutionContext } from '@nestjs/common';

const mockChatService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  findAllChatsOfUser: jest.fn(),
  findChatByTravelId: jest.fn(),
};

describe('ChatResolver', () => {
  let resolver: ChatResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatResolver,
        {
          provide: ChatService,
          useValue: mockChatService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    resolver = module.get<ChatResolver>(ChatResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of chats', async () => {
      const chats: Chat[] = [{ id: '1', travel: null, users: [], messages: [] }];
      mockChatService.findAll.mockResolvedValue(chats);

      expect(await resolver.findAll()).toEqual(chats);
      expect(mockChatService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single chat', async () => {
      const chat: Chat = { id: '1', travel: null, users: [], messages: [] };
      mockChatService.findOne.mockResolvedValue(chat);

      expect(await resolver.findOne('1')).toEqual(chat);
      expect(mockChatService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('findChatsOfUser', () => {
    it('should return chats for a specific user', async () => {
      const chats: Chat[] = [{ id: '1', travel: null, users: [], messages: [] }];
      mockChatService.findAllChatsOfUser.mockResolvedValue(chats);

      const context = { req: { user: { userId: '1' } } };
      expect(await resolver.findChatsOfUser(context)).toEqual(chats);
      expect(mockChatService.findAllChatsOfUser).toHaveBeenCalledWith('1');
    });
  });

  describe('findChatByTravelId', () => {
    it('should return a chat for a specific travel ID', async () => {
      const chat: Chat = { id: '1', travel: null, users: [], messages: [] };
      mockChatService.findChatByTravelId.mockResolvedValue(chat);

      expect(await resolver.findChatByTravelId('1')).toEqual(chat);
      expect(mockChatService.findChatByTravelId).toHaveBeenCalledWith('1');
    });
  });
});
