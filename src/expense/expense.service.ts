import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createExpenseDto.userId },
    });
    if (!user) {
    throw new NotFoundException(`User #${createExpenseDto.userId} not found`);
  }
  if (createExpenseDto.goalId) {
    const goal = await this.prisma.savingGoal.findUnique({
      where: { id: createExpenseDto.goalId },
    });
    if (!goal) {
      throw new NotFoundException(`Saving Goal #${createExpenseDto.goalId} not found`);
    }
  }
  return this.prisma.expense.create({
      data: {
        title: createExpenseDto.title,
        amount: createExpenseDto.amount,
        userId: createExpenseDto.userId,
        ...(createExpenseDto.currency ? { currency: createExpenseDto.currency } : {}),
        ...(createExpenseDto.goalId ? { goalId: createExpenseDto.goalId } : {}),
      },
    });
  }

  async findAll(goalId?: number) {
    console.log('goalId:', goalId);
    return this.prisma.expense.findMany({
      where: goalId ? { goalId } : undefined,
      orderBy: { date: 'desc' },
    });
  }

  async findByGoal(goalId: number) {
    return this.prisma.expense.findMany({
      where: goalId ? { goalId } : undefined,
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });
    if (!expense) {
      throw new NotFoundException(`Expense #${id} not found`);
    }
    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    await this.findOne(id);

    const data: {
      title?: string;
      amount?: number;
      currency?: string;
      category?: string;
      userId?: number;
    } = {
      title: updateExpenseDto.title,
      amount: updateExpenseDto.amount,
      currency: updateExpenseDto.currency,
    };

    if (updateExpenseDto.userId !== undefined) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateExpenseDto.userId },
      });

      if (!user) {
        throw new NotFoundException(`User #${updateExpenseDto.userId} not found`);
      }

      data.userId = updateExpenseDto.userId;
    }

    return this.prisma.expense.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.expense.delete({
      where: { id },
    });
  }
}
