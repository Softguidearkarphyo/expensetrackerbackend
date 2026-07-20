import { Module } from '@nestjs/common';
import { SavingGoalService } from './saving-goal.service';
import { SavingGoalController } from './saving-goal.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SavingGoalController],
  providers: [SavingGoalService, PrismaService],
})
export class SavingGoalModule {}
