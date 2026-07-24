import { IsNotEmpty, IsNumber, IsOptional, IsString, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSavingTransactionDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  goalId!: number;
}