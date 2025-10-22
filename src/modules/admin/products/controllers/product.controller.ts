import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductViewDto } from '../dto/product-view.dto';
import { ProductViewService } from '../service/products-view.service';
import { ProductStoreService } from '../service/products-store.service';
import { ProductStoreDto } from '../dto/product-store.dto';

@ApiTags('Admin/Product')
@Controller({ path: '/admin/products', version: '1' })
export class ProductController {
	constructor(
		private readonly productViewService: ProductViewService,
		private readonly productStoreService: ProductStoreService,
	) {}

	@Get()
	async view(@Query() dto: ProductViewDto, @Res() res: FastifyReply) {
		return this.productViewService.handle(dto, res);
	}

	@Get('/:id')
	async show(@Query() dto: ProductViewDto, @Res() res: FastifyReply) {
		return this.productViewService.handle(dto, res);
	}

	@Post()
	async store(@Body() dto: ProductStoreDto, @Res() res: FastifyReply) {
		return this.productStoreService.handle(dto, res);
	}
}
