import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repository';
import { ValidateBankAccountOwnerShipService } from '../bank-accounts/services/validate-bank-account-ownership.service';
import { ValidateCategoryOwnerShipService } from '../categories/services/validate-category-ownership.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionsRepository,
    private readonly validateBankAccountOwnerShipService: ValidateBankAccountOwnerShipService,
    private readonly validateCategoryOwnerShipService: ValidateCategoryOwnerShipService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { bankAccountId, categoryId, name, value, type, date } =
      createTransactionDto;

    await this.validateEntitiesOwnership({ userId, bankAccountId, categoryId });

    return this.transactionRepository.create({
      data: {
        userId,
        bankAccountId,
        categoryId,
        name,
        value,
        type,
        date,
      },
    });
  }

  findAllByUserId(userId: string) {
    return this.transactionRepository.findMAny({
      where: { userId },
    });
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return { id, updateTransactionDto };
  }

  remove(id: string) {
    return `This action removes a #${id} transaction`;
  }

  private async validateEntitiesOwnership({
    userId,
    bankAccountId,
    categoryId,
  }: {
    userId: string;
    bankAccountId: string;
    categoryId: string;
  }) {
    await Promise.all([
      this.validateBankAccountOwnerShipService.validate(userId, bankAccountId),
      this.validateCategoryOwnerShipService.validate(userId, categoryId),
    ]);
  }
}
