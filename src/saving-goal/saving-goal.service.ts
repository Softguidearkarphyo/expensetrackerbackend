import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSavingGoalDto } from './dto/create-saving-goal.dto';
import { UpdateSavingGoalDto } from './dto/update-saving-goal.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SavingGoalService {
  constructor(private prisma: PrismaService) {}

  async create(createSavingGoalDto: CreateSavingGoalDto) {
    const existingSavingGoal = await this.prisma.savingGoal.findFirst({
      where: {
        title: createSavingGoalDto.title,
        userId: createSavingGoalDto.userId,
      },
    });

    if (existingSavingGoal) {
      throw new Error('You already have a saving goal with this name.');
    }

    return this.prisma.savingGoal.create({
      data: {
        title: createSavingGoalDto.title,
        targetAmount: createSavingGoalDto.targetAmount,
        currency: createSavingGoalDto.currency,
        status: createSavingGoalDto.status,
        userId: createSavingGoalDto.userId,
      },
    });
  }

  async findAll(userId?: number) {
    return this.prisma.savingGoal.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const goal = await this.prisma.savingGoal.findUnique({
      where: { id },
      include: {
        transactions: true,
      },
    });

    if (!goal) {
      throw new NotFoundException(`SavingGoal #${id} not found`);
    }

    return goal;
  }

  async update(id: number, updateSavingGoalDto: UpdateSavingGoalDto) {
    await this.findOne(id);

    return this.prisma.savingGoal.update({
      where: { id },
      data: {
        title: updateSavingGoalDto.title,
        targetAmount: updateSavingGoalDto.targetAmount,
        currency: updateSavingGoalDto.currency,
        status: updateSavingGoalDto.status,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.savingGoal.delete({
      where: { id },
    });
  }
}
