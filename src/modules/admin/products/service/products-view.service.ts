import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ProductViewTransform } from '../transform/product-view.transform';
import { ProductViewDto } from '../dto/product-view.dto';
import TransformerPaginate, {
	PaginateResult,
} from '@/common/modules/transformers/TransformerPaginate';
import { CoreService } from '@/common/modules/services/core.service';

@Injectable()
export class ProductViewService {
	constructor(private readonly prisma: PrismaService) {}

	async handle(
		dto: ProductViewDto,
		@Res() response: FastifyReply,
	): Promise<PaginateResult<ProductViewTransform>> {
		const filter: any = {};
		const { name, sku, page, limit } = dto;

		if (name) {
			filter.name = { contains: name };
		}

		if (sku) {
			filter.sku = { contains: sku };
		}
		const { skip, take } = this.prisma.calculateOffset(
			Number(page),
			Number(limit),
		);

		const products = await this.prisma.product.findMany({
			where: filter,
			take: take,
			skip: skip,
			orderBy: { updated_at: 'desc' },
			select: {
				product_id: true,
				sku: true,
				name: true,
				description: true,
				summary: true,
				cover: true,
				status: true,
				created_at: true,
				updated_at: true,
				category: {
					select: {
						id: true,
						name: true,
					},
				},
				createdBy: {
					select: {
						id: true,
						name: true,
					},
				},
				updatedBy: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});
		const total = await this.prisma.product.count({ where: filter });

		return new CoreService(response).responsePaginate(
			products,
			total,
			take,
			skip,
			ProductViewTransform,
		);
	}
}
