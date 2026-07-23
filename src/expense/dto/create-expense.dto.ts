import { IsNotEmpty, IsNumber, IsString, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  goalId!: number;
}