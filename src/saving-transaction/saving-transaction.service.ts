import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSavingTransactionDto } from './dto/create-saving-transaction.dto';
import { UpdateSavingTransactionDto } from './dto/update-saving-transaction.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SavingTransactionService {
  constructor(private prisma: PrismaService) {}

  async create(createSavingTransactionDto: CreateSavingTransactionDto) {
    const goal = await this.prisma.savingGoal.findUnique({
      where: { id: createSavingTransactionDto.goalId },
    });

    if (!goal) {
      throw new NotFoundException(`SavingGoal #${createSavingTransactionDto.goalId} not found`);
    }

    return this.prisma.savingTransaction.create({
      data: {
        amount: createSavingTransactionDto.amount,
        date: new Date(),
        note: createSavingTransactionDto.note,
        goalId: createSavingTransactionDto.goalId,
      },
    });
  }

  async findAll(goalId?: number) {
    return this.prisma.savingTransaction.findMany({
      where: goalId ? { goalId } : undefined,
      orderBy: { date: 'desc' },
    });
  }

  async findFinanceByGoal(goalId?: number) {
    return this.prisma.savingTransaction.findMany({
      where: goalId ? { goalId } : undefined,
      orderBy: { date: 'desc' },
    });
  }

  async findFinanceCountByGoal(goalId?: number) {
    const finances = await this.prisma.savingTransaction.findMany({
      where: goalId ? { goalId } : undefined,
      orderBy: { date: 'desc' },
    });

    const totalAmount = finances.reduce(
      (total, finance) => {
        return total + Number(finance.amount);
      },
      0
    );

    return {
      totalAmount,
    };
    
  }

  async findOne(id: number) {
    const transaction = await this.prisma.savingTransaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`SavingTransaction #${id} not found`);
    }

    return transaction;
  }

  async update(id: number, updateSavingTransactionDto: UpdateSavingTransactionDto) {
    await this.findOne(id);

    return this.prisma.savingTransaction.update({
      where: { id },
      data: {
        amount: updateSavingTransactionDto.amount,
        note: updateSavingTransactionDto.note,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.savingTransaction.delete({
      where: { id },
    });
  }
}
