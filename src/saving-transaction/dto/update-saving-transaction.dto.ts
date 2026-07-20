import { PartialType } from '@nestjs/mapped-types';
import { CreateSavingTransactionDto } from './create-saving-transaction.dto';

export class UpdateSavingTransactionDto extends PartialType(CreateSavingTransactionDto) {}
