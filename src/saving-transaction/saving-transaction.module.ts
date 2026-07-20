import { Module } from '@nestjs/common';
import { SavingTransactionService } from './saving-transaction.service';
import { SavingTransactionController } from './saving-transaction.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SavingTransactionController],
  providers: [SavingTransactionService, PrismaService],
})
export class SavingTransactionModule {}
