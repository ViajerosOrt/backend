import { Test, TestingModule } from '@nestjs/testing';
import { TravelResolver } from './travel.resolver';
import { TravelService } from './travel.service';

describe('TravelResolver', () => {
  let resolver: TravelResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelResolver, TravelService],
    }).compile();

    resolver = module.get<TravelResolver>(TravelResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
