import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-saving-goal.dto';
import { UpdateGoalDto } from './dto/update-saving-goal.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GoalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGoalDto: CreateGoalDto) {
    const existingGoal = await this.prisma.goal.findFirst({
      where: {
        title: createGoalDto.title,
        userId: createGoalDto.userId,
      },
    });

    if (existingGoal) {
      throw new BadRequestException('You already have a goal with this name.');
    }

    return this.prisma.goal.create({
      data: {
        title: createGoalDto.title,
        targetAmount: createGoalDto.targetAmount,
        currency: createGoalDto.currency ?? 'MMK',
        status: createGoalDto.status ?? 1,
        userId: createGoalDto.userId,
      },
    });
  }

  async findAll(userId?: number) {
    return this.prisma.goal.findMany({
      where: userId ? { userId } : undefined,
      include: {
        savings: {
          take: 5,
          orderBy: { date: 'desc' },
        },
        expenses: {
          take: 5,
          orderBy: { date: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const goal = await this.prisma.goal.findUnique({
      where: { id },
      include: {
        savings: {
          orderBy: { date: 'desc' },
        },
        expenses: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!goal) {
      throw new NotFoundException(`Goal #${id} not found`);
    }

    return goal;
  }

  async update(id: number, updateGoalDto: UpdateGoalDto) {
    await this.findOne(id);

    return this.prisma.goal.update({
      where: { id },
      data: {
        ...(updateGoalDto.title && { title: updateGoalDto.title }),
        ...(updateGoalDto.targetAmount && { targetAmount: updateGoalDto.targetAmount }),
        ...(updateGoalDto.currency && { currency: updateGoalDto.currency }),
        ...(updateGoalDto.status !== undefined && { status: updateGoalDto.status }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.goal.delete({
      where: { id },
    });
  }
}