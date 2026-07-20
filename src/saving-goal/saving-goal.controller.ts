import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SavingGoalService } from './saving-goal.service';
import { CreateSavingGoalDto } from './dto/create-saving-goal.dto';
import { UpdateSavingGoalDto } from './dto/update-saving-goal.dto';

@Controller('saving-goal')
export class SavingGoalController {
  constructor(private readonly savingGoalService: SavingGoalService) {}

  @Post()
  create(@Body() createSavingGoalDto: CreateSavingGoalDto) {
    return this.savingGoalService.create(createSavingGoalDto);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.savingGoalService.findAll(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.savingGoalService.findOne(+id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSavingGoalDto: UpdateSavingGoalDto) {
    return this.savingGoalService.update(+id, updateSavingGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savingGoalService.remove(+id);
  }
}
