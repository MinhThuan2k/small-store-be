import { IsOptional } from 'class-validator';

export class ProductViewDto {
  @IsOptional()
  name: string;

  @IsOptional()
  sku: string;

  @IsOptional()
  page: string | number;

  @IsOptional()
  limit: string | number;
}
