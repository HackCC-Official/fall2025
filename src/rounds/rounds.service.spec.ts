import { Test, TestingModule } from '@nestjs/testing';
import { RoundsService } from './rounds.service';

describe('RoundsService', () => {
  let service: RoundsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoundsService],
    }).compile();

    service = module.get<RoundsService>(RoundsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
