import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repository';
import { ValidateBankAccountOwnerShipService } from 'src/modules/bank-accounts/services/validate-bank-account-ownership.service';
import { ValidateCategoryOwnershipService } from 'src/modules/categories/services/validate-category-ownership.service';
import { ValidateTransactionOwnershipService } from './validate-transaction-ownership.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionsRepository,
    private readonly validateBankAccountOwnerShipService: ValidateBankAccountOwnerShipService,
    private readonly validateCategoryOwnerShipService: ValidateCategoryOwnershipService,
    private readonly validateTransactionOwnershipService: ValidateTransactionOwnershipService,
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

  findAllByUserId(userId: string, filters: { month: number; year: number }) {
    const { year, month } = filters;
    return this.transactionRepository.findMAny({
      where: {
        userId,
        date: {
          gte: new Date(Date.UTC(year, month)),
          lt: new Date(Date.UTC(year, month)),
        },
      },
    });
  }

  async update(
    userId: string,
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const { bankAccountId, categoryId, name, value, type, date } =
      updateTransactionDto;
    await this.validateEntitiesOwnership({
      userId,
      bankAccountId,
      categoryId,
      transactionId,
    });

    return this.transactionRepository.update({
      where: { id: transactionId },
      data: {
        bankAccountId,
        categoryId,
        name,
        value,
        type,
        date,
      },
    });
  }

  async remove(userId: string, transactionId: string) {
    await this.validateEntitiesOwnership({ userId, transactionId });

    await this.transactionRepository.delete({
      where: { id: transactionId },
    });

    return null;
  }

  private async validateEntitiesOwnership({
    userId,
    bankAccountId,
    categoryId,
    transactionId,
  }: {
    userId: string;
    bankAccountId?: string;
    categoryId?: string;
    transactionId?: string;
  }) {
    await Promise.all([
      transactionId &&
        this.validateTransactionOwnershipService.validate(
          userId,
          transactionId,
        ),
      bankAccountId &&
        this.validateBankAccountOwnerShipService.validate(
          userId,
          bankAccountId,
        ),
      categoryId &&
        this.validateCategoryOwnerShipService.validate(userId, categoryId),
    ]);
  }
}
