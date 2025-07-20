import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './services/categories.service';
import { ValidateCategoryOwnerShipService } from './services/validate-category-ownership.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, ValidateCategoryOwnerShipService],
  exports: [ValidateCategoryOwnerShipService],
})
export class CategoriesModule {}
