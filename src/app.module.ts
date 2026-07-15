import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ExpenseModule } from './expense/expense.module';
import { SavingModule } from './saving/saving.module';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule, 
    ExpenseModule, 
    SavingModule, 
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService
  ],
})
export class AppModule {}
