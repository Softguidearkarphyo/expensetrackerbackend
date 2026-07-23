import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSavingTransactionDto } from './dto/create-saving-transaction.dto';
import { UpdateSavingTransactionDto } from './dto/update-saving-transaction.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SavingTransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSavingTransactionDto: CreateSavingTransactionDto) {
    const { amount, note, goalId } = createSavingTransactionDto;
    const goal = await this.prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      throw new NotFoundException(`Goal #${goalId} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      const saving = await tx.saving.create({
        data: {
          amount,
          title: note,
          date: new Date(),
          goalId,
        },
      });

      await tx.goal.update({
        where: { id: goalId },
        data: {
          currentAmount: {
            increment: amount,
          },
        },
      });

      return saving;
    });
  }

  async findAll(goalId?: number) {
    return this.prisma.saving.findMany({
      where: goalId ? { goalId } : undefined,
      orderBy: { date: 'desc' },
    });
  }

  async findFinanceByGoal(goalId?: number) {
    return this.prisma.saving.findMany({
      where: goalId ? { goalId } : undefined,
      orderBy: { date: 'desc' },
    });
  }

  async findFinanceCountByGoal(goalId?: number) {
    const aggregation = await this.prisma.saving.aggregate({
      where: goalId ? { goalId } : undefined,
      _sum: {
        amount: true,
      },
    });

    return {
      totalAmount: aggregation._sum.amount ? Number(aggregation._sum.amount) : 0,
    };
  }

  async findOne(id: number) {
    const saving = await this.prisma.saving.findUnique({
      where: { id },
    });

    if (!saving) {
      throw new NotFoundException(`Saving #${id} not found`);
    }

    return saving;
  }

  async update(id: number, updateSavingTransactionDto: UpdateSavingTransactionDto) {
    const oldSaving = await this.findOne(id);
    const newAmount = updateSavingTransactionDto.amount;

    // Adjust goal balance if amount changed during update
    if (newAmount !== undefined && Number(newAmount) !== Number(oldSaving.amount)) {
      const amountDifference = Number(newAmount) - Number(oldSaving.amount);

      return this.prisma.$transaction(async (tx) => {
        const updatedSaving = await tx.saving.update({
          where: { id },
          data: {
            amount: newAmount,
            title: updateSavingTransactionDto.note,
          },
        });

        await tx.goal.update({
          where: { id: oldSaving.goalId },
          data: {
            currentAmount: {
              increment: amountDifference,
            },
          },
        });

        return updatedSaving;
      });
    }

    return this.prisma.saving.update({
      where: { id },
      data: {
        title: updateSavingTransactionDto.note,
      },
    });
  }

  async remove(id: number) {
    const saving = await this.findOne(id);

    // Atomic transaction: delete saving record AND decrement goal currentAmount
    return this.prisma.$transaction(async (tx) => {
      const deletedSaving = await tx.saving.delete({
        where: { id },
      });

      await tx.goal.update({
        where: { id: saving.goalId },
        data: {
          currentAmount: {
            decrement: saving.amount,
          },
        },
      });

      return deletedSaving;
    });
  }
}