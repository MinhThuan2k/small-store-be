import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
	IsNotEmpty,
	IsOptional,
	MaxLength,
	MinLength,
	ValidationOptions,
} from 'class-validator';

export type IFieldOption = {
	each?: boolean;
};
export type LengthOption =
	| number
	| { value: number; option?: ValidationOptions };

export type OptionString = IFieldOption & {
	isNotEmpty?: boolean | ValidationOptions;
	isOptional?: boolean | ValidationOptions;
	maxLength?: LengthOption;
	minLength?: LengthOption;
};
export function FieldString(options: OptionString = {}) {
	const decorator = [Type(() => String)];
	const optional: ValidationOptions = { each: options.each ?? false };

	if (options.isNotEmpty) {
		let optionIsNotEmpty = optional;
		if (typeof options.isNotEmpty !== 'boolean') {
			optionIsNotEmpty = {
				...optionIsNotEmpty,
				...(options.isNotEmpty as ValidationOptions),
			};
		}
		decorator.push(IsNotEmpty(optionIsNotEmpty));
	}

	if (options.isOptional) {
		let optionIsOptional = optional;
		if (typeof options.isOptional !== 'boolean') {
			optionIsOptional = {
				...optionIsOptional,
				...(options.isOptional as ValidationOptions),
			};
		}
		decorator.push(IsOptional(optionIsOptional));
	}

	if (options.maxLength) {
		if (typeof options.maxLength === 'number') {
			decorator.push(MaxLength(options.maxLength, optional));
		} else {
			decorator.push(
				MaxLength(options.maxLength.value, {
					...optional,
					...(options.maxLength.option as ValidationOptions),
				}),
			);
		}
	}

	if (options.minLength) {
		if (typeof options.minLength === 'number') {
			decorator.push(MinLength(options.minLength, optional));
		} else {
			decorator.push(
				MinLength(options.minLength.value, {
					...optional,
					...(options.minLength.option as ValidationOptions),
				}),
			);
		}
	}

	return applyDecorators(...decorator);
}
