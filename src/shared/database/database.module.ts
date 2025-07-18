import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

import { UsersRepository } from './repositories/users.repository';
import { CategoriesRepository } from './repositories/categories.repository';
import { BankAccountsRepository } from './repositories/bank-acounts.respository';

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    CategoriesRepository,
    BankAccountsRepository,
  ],
  exports: [UsersRepository, CategoriesRepository, BankAccountsRepository],
})
export class DatabaseModule {}
