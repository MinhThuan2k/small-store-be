import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductViewTransform } from '../transform/product-view.transform';
import { ProductViewDto } from '../dto/product-view.dto';
import TransformerPaginate, {
  PaginateResult,
} from '@/common/modules/transformers/TransformerPaginate';

@Injectable()
export class ProductViewService {
  constructor(private readonly prisma: PrismaService) {}

  async view(
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
      orderBy: { updatedAt: 'desc' },
      // include: {
      //   createdBy: true,
      // },
      select: {
        product_id: true,
        sku: true,
        name: true,
        description: true,
        summary: true,
        cover: true,
        status: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
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

    return response
      .status(200)
      .send(
        new TransformerPaginate(products, total, take, skip).paginate(
          ProductViewTransform,
        ),
      );
  }
}
