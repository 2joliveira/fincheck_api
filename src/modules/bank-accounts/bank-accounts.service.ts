import { Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-acounts.respository';

@Injectable()
export class BankAccountsService {
  constructor(private readonly bankAccountRepository: BankAccountsRepository) {}

  create(
    userId: string,
    { name, color, initialBalance, type }: CreateBankAccountDto,
  ) {
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

  update(id: number, updateBankAccountDto: UpdateBankAccountDto) {
    return { id, updateBankAccountDto };
  }

  remove(id: number) {
    return `This action removes a #${id} bankAccount`;
  }
}
