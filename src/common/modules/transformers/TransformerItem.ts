import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';

export type ItemResult<D> = {
  data: Record<string, D> | Record<string, D>[];
};

export default class TransformerItem<T> {
  private readonly items: T | T[];

  constructor(items: T | T[]) {
    this.items = items;
  }

  /**
   * Transformer for single item and array of items
   */
  transform<D>(transformer: ClassConstructor<D>): ItemResult<D> {
    const transformed = plainToInstance(transformer, this.items);
    return {
      data: instanceToPlain(transformed),
    };
  }
}
