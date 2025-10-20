import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductViewService } from './service';

@Module({
  controllers: [ProductController],
  providers: [ProductViewService],
})
export class ProductModule {}
