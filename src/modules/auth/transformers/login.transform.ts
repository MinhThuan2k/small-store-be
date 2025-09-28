import { Expose, Transform } from 'class-transformer';

export class LoginTransform {
  @Expose()
  token: string;

  @Expose()
  @Transform((obj) => ({
    id: obj.value.id,
    email: obj.value.email,
    name: obj.value.name,
  }))
  user: object;
}
