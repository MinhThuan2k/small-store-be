import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductStoreService } from './service/products-store.service';
import { ProductViewService } from './service/products-view.service';

@Module({
	controllers: [ProductController],
	providers: [ProductViewService, ProductStoreService],
})
export class ProductModule {}
