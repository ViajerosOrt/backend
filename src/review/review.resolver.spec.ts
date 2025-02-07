import { Test, TestingModule } from '@nestjs/testing';
import { ReviewResolver } from './review.resolver';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';

describe('ReviewResolver', () => {
  let resolver: ReviewResolver;
  let service: ReviewService;

  const mockReview: Review = {
    id: '1',
    stars: '5',
    content: 'Great experience!',
    type: 'positive',
    createdUserBy: {
      id: '1',
      name: 'John Doe',
    } as any, 
    receivedUserBy: {
      id: '2',
      name: 'Jane Smith',
    } as any, 
    travel: {
      id: '10',
      name: 'Amazing Adventure',
    } as any, // Simplificado para el mock
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewResolver,
        {
          provide: ReviewService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ReviewResolver>(ReviewResolver);
    service = module.get<ReviewService>(ReviewService);
  });

  describe('createReview', () => {
    it('should create a review', async () => {
      const createReviewInput: CreateReviewInput = {
        stars: '5',
        content: 'Great experience!',
      };
      const mockContext = { req: { user: { userId: '1' } } };
      const userReceiverId = '2';
      const travelId = '10';

      jest.spyOn(service, 'create').mockResolvedValue(mockReview);

      expect(await resolver.createReview(createReviewInput, mockContext, userReceiverId, travelId)).toEqual(mockReview);
      expect(service.create).toHaveBeenCalledWith(createReviewInput, mockContext.req.user.userId, userReceiverId, travelId);
    });
  });

  describe('findAll', () => {
    it('should return a list of reviews', async () => {
      const result = [mockReview];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single review', async () => {
      const reviewId = '1';

      jest.spyOn(service, 'findOne').mockResolvedValue(mockReview);

      expect(await resolver.findOne(reviewId)).toEqual(mockReview);
    });
  });

  describe('updateReview', () => {
    it('should update a review', async () => {
      const updateReviewInput: UpdateReviewInput = {
        stars: '4',
        content: 'Updated content',
      };
      const reviewId = '1';
      const mockContext = { req: { user: { userId: '1' } } };

      jest.spyOn(service, 'update').mockResolvedValue(mockReview);

      expect(await resolver.updateReview(reviewId, updateReviewInput, mockContext)).toEqual(mockReview);
      expect(service.update).toHaveBeenCalledWith(reviewId, updateReviewInput, mockContext.req.user.userId);
    });
  });

  describe('removeReview', () => {
    it('should remove a review', async () => {
      const reviewId = '1';
  
      jest.spyOn(service, 'remove').mockResolvedValue(undefined); 
  
      expect(await resolver.removeReview(reviewId)).toEqual('review successfully deleted'); 
      expect(service.remove).toHaveBeenCalledWith(reviewId);
    });
  });
  
});
