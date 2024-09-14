import { CreateJobValidationMessage } from './job-validation-message.js';
import { IsString, IsNumber, IsOptional, IsMongoId, IsIn } from 'class-validator';
import { registerDecorator, ValidationOptions, ValidationArguments, isISO8601 } from 'class-validator';
import { TNameOfJob } from '../../../types/index.js';
import { NAMESOFJOB } from '../../../types/const.js';

export function IsISO8601OrDash(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isISO8601OrDash',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value) {
          return isISO8601(value) || typeof value === 'string';
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ISO 8601 date or -`;
        },
      },
    });
  };
}

export class CreateJobDto {
  @IsMongoId({ message: CreateJobValidationMessage.employeeId.invalidId })
  public employeeId: string;

  // @IsISO8601({}, {message: CreateJobValidationMessage.timeFrom.invalidFormat})
  @IsISO8601OrDash({message: CreateJobValidationMessage.timeFrom.invalidFormat})
  public timeFrom: string;

  @IsISO8601OrDash({message: CreateJobValidationMessage.timeTo.invalidFormat})
  public timeTo: string;

  @IsMongoId({ message: CreateJobValidationMessage.detailId.invalidId })
  public detailId: string;

  @IsIn(NAMESOFJOB)
  public typeOfJob: TNameOfJob;

  @IsOptional()
  @IsNumber(undefined, { message: CreateJobValidationMessage.extra.invalidFormat })
  public extra: number;

  @IsNumber(undefined, { message: CreateJobValidationMessage.quantity.invalidFormat })
  public quantity: number;

  @IsOptional()
  @IsString({message: CreateJobValidationMessage.comment.invalidFormat})
  public comment: string;

  // @IsMongoId({ message: CreateJobValidationMessage.master.invalidId })
  public master: string;
}
