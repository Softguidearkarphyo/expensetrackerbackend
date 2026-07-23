import { PartialType } from '@nestjs/mapped-types';
import { CreateGoalDto } from './create-saving-goal.dto';

export class UpdateGoalDto extends PartialType(CreateGoalDto) {}
