import { Type } from 'class-transformer';
import {
	IsArray,
	IsIn,
	IsNotEmpty,
	IsOptional,
	ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ProductStoreDto {
	@IsNotEmpty({
		message: i18nValidationMessage('validation.name_required', {
			defaultMessage: 'Name is required',
		}),
	})
	name: string;

	@IsNotEmpty({
		message: i18nValidationMessage('validation.sku_required', {
			defaultMessage: 'Sku is required',
		}),
	})
	sku: string;

	@IsOptional()
	description: string;

	@IsOptional()
	summary: string;

	@IsOptional()
	cover: string;

	@IsOptional()
	@IsIn(['AC', 'IA'], {
		message: i18nValidationMessage('validation.status_invalid', {
			defaultMessage: 'Status must be AC or IA',
		}),
	})
	status: string;

	@IsNotEmpty()
	category_id: number;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProductAttributeDto)
	attributes?: ProductAttributeDto[];
}

class ProductAttributeDto {
	@IsNotEmpty()
	attribute_id: number;

	@IsNotEmpty()
	value: string;
}
