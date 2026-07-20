import { IsNotEmpty,IsString } from 'class-validator';

export class CreateSavingGoalDto {
  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  targetAmount!: number;

  @IsNotEmpty()
  status!: string;

  @IsNotEmpty()
  @IsString()
  currency!: string;

  @IsNotEmpty()
  userId!: number;
}

