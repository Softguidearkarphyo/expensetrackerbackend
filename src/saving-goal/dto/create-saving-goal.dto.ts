import { IsNotEmpty, IsNumber, IsOptional, IsString, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGoalDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  targetAmount!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  userId!: number;
}