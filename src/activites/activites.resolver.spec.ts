import { Test, TestingModule } from '@nestjs/testing';
import { ActivitesResolver } from './activites.resolver';

describe('ActivitesResolver', () => {
  let resolver: ActivitesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivitesResolver],
    }).compile();

    resolver = module.get<ActivitesResolver>(ActivitesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
