import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SavingTransactionService } from './saving-transaction.service';
import { CreateSavingTransactionDto } from './dto/create-saving-transaction.dto';
import { UpdateSavingTransactionDto } from './dto/update-saving-transaction.dto';

@Controller('saving-transaction')
export class SavingTransactionController {
  constructor(private readonly savingTransactionService: SavingTransactionService) {}

  @Post()
  create(@Body() createSavingTransactionDto: CreateSavingTransactionDto) {
    return this.savingTransactionService.create(createSavingTransactionDto);
  }

  @Get()
  findAll(@Query('goalId') goalId?: string) {
    return this.savingTransactionService.findAll(goalId ? +goalId : undefined);
  }


  @Get('finance/:goalId')
  findFinanceByGoal(@Param('goalId') goalId?: string) {
    return this.savingTransactionService.findFinanceByGoal(goalId ? +goalId : undefined);
  }

  @Get('goal/:goalId')
  findByGoal(@Param('goalId') goalId: string) {
    return this.savingTransactionService.findFinanceCountByGoal(goalId ? +goalId : undefined);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.savingTransactionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSavingTransactionDto: UpdateSavingTransactionDto) {
    return this.savingTransactionService.update(+id, updateSavingTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savingTransactionService.remove(+id);
  }
}
