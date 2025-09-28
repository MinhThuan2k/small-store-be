import { Expose } from 'class-transformer';

export class ProfileTransform {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;
}
