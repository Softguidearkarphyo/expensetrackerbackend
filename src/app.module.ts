import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ExpenseModule } from './expense/expense.module';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { GoalModule } from './saving-goal/saving-goal.module';
import { SavingTransactionModule } from './saving-transaction/saving-transaction.module';

@Module({
  imports: [
    UsersModule, 
    ExpenseModule, 
    AuthModule, 
    GoalModule, 
    SavingTransactionModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService
  ],
})
export class AppModule {}
