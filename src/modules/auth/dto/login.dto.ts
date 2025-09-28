import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email of user',
    example: 'admin@123',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password of user',
    example: 'admin@123',
  })
  @IsNotEmpty({ message: 'Email không được để trống!' })
  password: string;
}
