import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const { title, amount, goalId } = createExpenseDto;

    // 1. Verify Goal exists
    const goal = await this.prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      throw new NotFoundException(`Goal #${goalId} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          title,
          amount,
          goalId,
          date: new Date(),
        },
      });
      
      await tx.goal.update({
        where: { id: goalId },
        data: {
          currentAmount: {
            decrement: amount,
          },
        },
      });

      return expense;
    });
  }

  async findAll(goalId?: number) {
    return this.prisma.expense.findMany({
      where: goalId ? { goalId } : undefined,
      orderBy: { date: 'desc' },
    });
  }

  async findByGoal(goalId: number) {
    return this.prisma.expense.findMany({
      where: { goalId },
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

  async findExpenseByGoal(goalId?: number) {
    const aggregation = await this.prisma.expense.aggregate({
      where: goalId ? { goalId } : undefined,
      _sum: {
        amount: true,
      },
    });

    return {
      totalAmount: aggregation._sum.amount ? Number(aggregation._sum.amount) : 0,
    };
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    const oldExpense = await this.findOne(id);
    const newAmount = updateExpenseDto.amount;

    // Adjust goal balance if amount changed during update
    if (newAmount !== undefined && Number(newAmount) !== Number(oldExpense.amount)) {
      const amountDifference = Number(newAmount) - Number(oldExpense.amount);

      return this.prisma.$transaction(async (tx) => {
        const updatedExpense = await tx.expense.update({
          where: { id },
          data: {
            title: updateExpenseDto.title,
            amount: newAmount,
          },
        });

        await tx.goal.update({
          where: { id: oldExpense.goalId },
          data: {
            currentAmount: {
              decrement: amountDifference,
            },
          },
        });

        return updatedExpense;
      });
    }

    return this.prisma.expense.update({
      where: { id },
      data: {
        title: updateExpenseDto.title,
      },
    });
  }

  async remove(id: number) {
    const expense = await this.findOne(id);
    return this.prisma.$transaction(async (tx) => {
      const deletedExpense = await tx.expense.delete({
        where: { id },
      });

      await tx.goal.update({
        where: { id: expense.goalId },
        data: {
          currentAmount: {
            increment: expense.amount,
          },
        },
      });

      return deletedExpense;
    });
  }
}