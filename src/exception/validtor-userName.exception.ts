import {
	registerDecorator,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsUserNameConstraint implements ValidatorConstraintInterface {
	validate(userName: string, args: ValidationArguments) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex = /^09[\u06F0-\u06F9]{9}$/; // Persian digits
		const usernameRegex = /^[a-zA-Z0-9_]+$/;

		return emailRegex.test(userName) || phoneRegex.test(userName) || usernameRegex.test(userName);
	}

	defaultMessage(args: ValidationArguments) {
		const userName = args.value;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex = /^09[\u06F0-\u06F9]{9}$/;
		const usernameRegex = /^[a-zA-Z0-9_]+$/;

		if (!emailRegex.test(userName) && !phoneRegex.test(userName) && !usernameRegex.test(userName)) {
			return 'userName must be a valid email, phone number (starting with 09 and in Persian), or a unique username';
		}

		if (!emailRegex.test(userName)) {
			return 'ایمیل باید صحیح باشد';
		}

		if (!phoneRegex.test(userName)) {
			return 'شماره تلفن باید با 09 شروع شود و شامل اعداد فارسی باشد';
		}

		if (!usernameRegex.test(userName)) {
			return 'نام کاربری باید شامل حروف انگلیسی، اعداد و زیرخط باشد';
		}

		return 'کاربر نامعتبر است';
	}
}

export function IsUserName(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsUserNameConstraint,
		});
	};
}
