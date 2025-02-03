import { Test, TestingModule } from '@nestjs/testing';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { UpdateMessageInput } from './dto/update-message.input';

describe('MessageResolver', () => {
  let resolver: MessageResolver;
  let service: MessageService;

  const mockMessage: Message = {
    id: '1',
    content: 'Mock content',
    createdAt: new Date(),
    user: null,
    chat: null,
    wasEdited: false
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageResolver,
        {
          provide: MessageService,
          useValue: {
            findMenssagesOfChat: jest.fn(),
            editMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<MessageResolver>(MessageResolver);
    service = module.get<MessageService>(MessageService);
  });

  describe('findMenssagesOfChat', () => {
    it('should return messages for a chat', async () => {
      const chatId = '123';
      const result = [mockMessage];

      jest.spyOn(service, 'findMenssagesOfChat').mockResolvedValue(result);

      expect(await resolver.findMenssagesOfChat(chatId)).toEqual(result);
    });
  });

  describe('editMessage', () => {
    it('should edit a message', async () => {
      const updateMessageInput: UpdateMessageInput = { content: 'Updated content' };
      const messageId = '1';
      const mockContext = { req: { user: { userId: '1' } } };

      jest.spyOn(service, 'editMessage').mockResolvedValue(mockMessage);

      expect(await resolver.editMessage(updateMessageInput, messageId, mockContext)).toEqual(mockMessage);
      expect(service.editMessage).toHaveBeenCalledWith(updateMessageInput, messageId, mockContext.req.user.userId);
    });
  });
});
