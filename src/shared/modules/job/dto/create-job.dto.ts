import { CreateJobValidationMessage } from './job-validation-message.js';
import { IsString, IsNumber, IsOptional, IsMongoId, IsIn, IsISO8601 } from 'class-validator';
import { TNameOfJob } from '../../../types/index.js';
import { NAMESOFJOB } from '../../../types/const.js';

export class CreateJobDto {
  @IsMongoId({ message: CreateJobValidationMessage.employeeId.invalidId })
  public employeeId: string;

  @IsISO8601({}, {message: CreateJobValidationMessage.timeFrom.invalidFormat})
  public timeFrom: string;

  @IsISO8601({}, {message: CreateJobValidationMessage.timeTo.invalidFormat})
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
