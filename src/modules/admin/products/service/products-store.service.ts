import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { CoreService } from '@/common/modules/services/core.service';
import { UserException } from '@/exception/UserException';
import { ProductStoreDto } from '../dto/product-store.dto';
import { I18nService } from 'nestjs-i18n';
import { ItemResult } from '@/common/modules/transformers/TransformerItem';
import { Product } from '@prisma/client';

@Injectable()
export class ProductStoreService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
	) {}

	async handle(
		dto: ProductStoreDto,
		@Res() response: FastifyReply,
	): Promise<Product> {
		const { name, sku, category_id } = dto;

		const existName = await this.prisma.product.findFirst({
			where: { name: name },
		});
		if (existName) {
			throw new UserException(this.i18n.t('Product name already exists'));
		}

		const existSku = await this.prisma.product.findFirst({
			where: { sku: sku },
		});
		if (existSku) {
			throw new UserException(this.i18n.t('Product sku already exists'));
		}

		const category = await this.prisma.category.findFirst({
			where: { id: category_id },
		});
		if (category) {
			throw new UserException(this.i18n.t('Category not found'));
		}

		const products = await this.prisma.product.create({
			data: {
				name: name,
				sku: sku,
				description: dto.description,
				summary: dto.summary,
				cover: dto.cover,
				status: dto.status,
				category: { connect: { id: category_id } },
				attributes: {
					create: dto.attributes,
				},
			},
		});

		return products;
	}
}
