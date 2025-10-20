import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductViewService } from '../service';
import { ProductViewDto } from '../dto/product-view.dto';

@ApiTags('Admin/Product')
@Controller({ path: '/admin/products', version: '1' })
export class ProductController {
  constructor(private readonly productViewService: ProductViewService) {}

  @Get('')
  async getProfile(@Query() dto: ProductViewDto, @Res() res: FastifyReply) {
    return this.productViewService.view(dto, res);
  }
}
