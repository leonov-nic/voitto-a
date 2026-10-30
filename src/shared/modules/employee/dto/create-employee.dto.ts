import { CreateEmployeeValidationMessage } from './employee-validation-message.js';
import { IsString, IsNumber, IsIn } from 'class-validator';
import { NAMESOFJOB } from '../../../types/const.js';
import { TNameOfJob } from '../../../types/index.js';

export class CreateEmployeeDto {

  @IsString({message: CreateEmployeeValidationMessage.familyName.invalidFormat})
  public familyName: string;

  @IsNumber(undefined, { message: CreateEmployeeValidationMessage.registrationNumber.invalidFormat })
  public registrationNumber: number;

  @IsIn(NAMESOFJOB)
  public mainJob: TNameOfJob;

  public masterId: string;

  // @Matches(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, {
  //   message: 'only english and russian letters',
  // })
  @IsString({message: CreateEmployeeValidationMessage.hiringChannel.invalidFormat})
  public hiringChannel: string;
}
