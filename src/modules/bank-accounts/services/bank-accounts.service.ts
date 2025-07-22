import { Injectable } from '@nestjs/common';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-acounts.respository';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto';
import { ValidateBankAccountOwnerShipService } from './validate-bank-account-ownership.service';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly bankAccountRepository: BankAccountsRepository,
    private readonly validateBankAccountOwnerShipService: ValidateBankAccountOwnerShipService,
  ) {}

  create(userId: string, createBankAccountDto: CreateBankAccountDto) {
    const { name, color, initialBalance, type } = createBankAccountDto;

    return this.bankAccountRepository.create({
      data: {
        name,
        color,
        initialBalance,
        type,
        userId,
      },
    });
  }

  async findAllByUserId(userId: string) {
    const bankAccounts = await this.bankAccountRepository.findMany({
      where: { userId },
      include: {
        transactions: {
          select: {
            type: true,
            value: true,
          },
        },
      },
    });

    return bankAccounts.map(({ transactions, ...account }) => {
      const totalTransactions = transactions.reduce(
        (acc, transaction) =>
          acc +
          (transaction.type === 'INCOME'
            ? transaction.value
            : -transaction.value),
        0,
      );

      const currentBalance = account.initialBalance + totalTransactions;

      return {
        ...account,
        currentBalance,
      };
    });
  }

  async update(
    userId: string,
    bankAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    const { name, color, initialBalance, type } = updateBankAccountDto;

    await this.validateBankAccountOwnerShipService.validate(
      userId,
      bankAccountId,
    );

    return this.bankAccountRepository.update({
      where: { id: bankAccountId },
      data: {
        name,
        color,
        initialBalance,
        type,
      },
    });
  }

  async remove(userId: string, bankAccountId: string) {
    await this.validateBankAccountOwnerShipService.validate(
      userId,
      bankAccountId,
    );

    await this.bankAccountRepository.delete({
      where: { id: bankAccountId },
    });

    return null;
  }
}
