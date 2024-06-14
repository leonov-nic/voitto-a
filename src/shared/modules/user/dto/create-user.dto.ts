import { Length, IsEmail, IsEnum, IsString } from 'class-validator';
import { PASSWORD_LENGTH } from '../index.js';
import { UserType } from '../../../types/index.js';

const CreateUserValidationMessage = {
  email: {
    invalidFormat: 'Mail must be a valid',
  },
  password: {
    invalidFormat: 'Password must be from 6 to 12 characters',
  },
  name: {
    invalidFormat: 'Name must be a valid string',
  },
  type: {
    invalidFormat: 'Type must be a valid variant string',
  },
};

export class CreateUserDto {
  @IsEmail({}, {message: CreateUserValidationMessage.email.invalidFormat})
  public email: string;

  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX, { message: CreateUserValidationMessage.password.invalidFormat })
  public password: string;

  @IsString({message: CreateUserValidationMessage.name.invalidFormat})
  public name: string;

  @IsEnum(UserType, { message: CreateUserValidationMessage.type.invalidFormat })
  public type: UserType;

  public avatar?: string;
}
