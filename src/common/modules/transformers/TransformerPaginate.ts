import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';

export type PaginateResult<D> = {
  data: Record<string, D> | Record<string, D>[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_page: number;
  };
};

export default class TransformerPaginate<T> {
  public readonly items: T[];
  public readonly total: number;
  public readonly take: number;
  public readonly skip: number;
  public readonly page: number | null;
  public readonly totalPage: number | null;

  constructor(items: T[], total: number, take: number, skip: number) {
    this.items = items;
    this.total = total;
    this.take = take;
    this.skip = skip;

    this.page = Math.floor(this.skip / this.take) + 1;
    this.totalPage = Math.ceil(this.total / this.take);
  }

  paginate<D>(transformer: ClassConstructor<D>): PaginateResult<D> {
    const transformed = plainToInstance(transformer, this.items, {
      excludeExtraneousValues: true,
    });

    return {
      data: instanceToPlain(transformed),
      meta: {
        total: this.total,
        page: this.page,
        limit: this.take,
        total_page: this.totalPage,
      },
    };
  }
}
