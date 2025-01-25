import { Test, TestingModule } from '@nestjs/testing';
import { RoundsController } from './rounds.controller';

describe('RoundsController', () => {
  let controller: RoundsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoundsController],
    }).compile();

    controller = module.get<RoundsController>(RoundsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
