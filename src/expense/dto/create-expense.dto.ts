import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsNotEmpty()
  @IsNumber()
  userId!: number;

  @IsNotEmpty()
  @IsNumber()
  goalId!: number;
}

