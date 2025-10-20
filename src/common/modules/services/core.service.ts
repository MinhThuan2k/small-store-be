import { FastifyReply } from 'fastify';
import TransformerItem from '../transformers/TransformerItem';
import { ClassConstructor } from 'class-transformer';
import TransformerPaginate from '../transformers/TransformerPaginate';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CoreService {
  protected readonly response: FastifyReply;

  constructor(response: FastifyReply) {
    this.response = response;
  }

  responseCreated(message?: string) {
    return this.response
      .status(HttpStatus.CREATED)
      .send({ message: message || 'OK' });
  }

  responseOke(message?: string) {
    return this.response
      .status(HttpStatus.OK)
      .send({ message: message || 'OK' });
  }

  responseItem<T, D>(
    items: T | T[],
    transformer: ClassConstructor<D>,
    status: number = HttpStatus.OK,
  ) {
    return this.response
      .status(status)
      .send(new TransformerItem(items).transform(transformer));
  }

  responsePaginate<T, D>(
    items: T[],
    total: number,
    take: number,
    skip: number,
    transformer: ClassConstructor<D>,
    status: number = HttpStatus.OK,
  ) {
    return this.response
      .status(status)
      .send(
        new TransformerPaginate(items, total, take, skip).transform(
          transformer,
        ),
      );
  }
}
