import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSavingTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsNotEmpty()
  @IsNumber()
  goalId!: number;
}
