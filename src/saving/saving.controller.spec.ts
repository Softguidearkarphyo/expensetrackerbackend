import { Test, TestingModule } from '@nestjs/testing';
import { SavingController } from './saving.controller';
import { SavingService } from './saving.service';

describe('SavingController', () => {
  let controller: SavingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavingController],
      providers: [SavingService],
    }).compile();

    controller = module.get<SavingController>(SavingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
