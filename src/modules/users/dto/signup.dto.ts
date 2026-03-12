import { FieldString } from '@/decorators/field.decorator';
import { IsNotEmpty } from 'class-validator';

export class SignUpDto {
	@FieldString({ isNotEmpty: true })
	email: string;

	@FieldString({ isNotEmpty: true })
	password: string;

	@FieldString({ isNotEmpty: true })
	name: string;
}
