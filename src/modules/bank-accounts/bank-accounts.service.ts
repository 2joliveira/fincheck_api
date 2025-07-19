import { Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-acounts.respository';

@Injectable()
export class BankAccountsService {
  constructor(private readonly bankAccountRepository: BankAccountsRepository) {}

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

  findAllByUserId(userId: string) {
    return this.bankAccountRepository.findMany({
      where: { userId },
    });
  }

  async update(
    userId: string,
    bankAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    const { name, color, initialBalance, type } = updateBankAccountDto;

    const isOwner = await this.bankAccountRepository.findFirst({
      where: { id: bankAccountId, userId },
    });

    if (!isOwner) {
      throw new Error('Bank account not found.');
    }

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

  remove(id: string) {
    return `This action removes a #${id} bankAccount`;
  }
}
