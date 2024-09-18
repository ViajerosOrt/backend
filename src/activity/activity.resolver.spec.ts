import { Test, TestingModule } from '@nestjs/testing';
import { ActivityResolver } from './activity.resolver';

describe('ActivityResolver', () => {
  let resolver: ActivityResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityResolver],
    }).compile();

    resolver = module.get<ActivityResolver>(ActivityResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
