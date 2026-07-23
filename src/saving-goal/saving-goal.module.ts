import { Module } from '@nestjs/common';
import { GoalService } from './saving-goal.service';
import { GoalController } from './saving-goal.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [GoalController],
  providers: [GoalService, PrismaService],
})
export class GoalModule {}
