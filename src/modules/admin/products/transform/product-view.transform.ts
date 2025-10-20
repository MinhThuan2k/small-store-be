import { Expose, Transform } from 'class-transformer';

export class ProductViewTransform {
  @Expose() @Transform((val) => Number(val.value)) product_id?: number;
  @Expose() sku?: string;
  @Expose() name?: string;
  @Expose() description?: string;
  @Expose() summary?: string;
  @Expose() cover?: string;
  @Expose() status?: string;
  @Expose() createdAt?: string;
  @Expose() updatedAt?: string;
  @Expose()
  @Transform((val) => {
    return { id: Number(val.value.id), name: val.value.name };
  })
  createdBy?: Record<string, any>;
  @Expose()
  @Transform((val) => {
    return { id: Number(val.value.id), name: val.value.name };
  })
  updatedBy?: Record<string, any>;
}
