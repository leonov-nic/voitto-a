import { CreateDetailValidationMessage } from './detail-validation-message.js';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateDetailDto {
  @IsString({message: CreateDetailValidationMessage.shortName.invalidFormat})
  public shortName: string;

  @IsString({message: CreateDetailValidationMessage.longName.invalidFormat})
  public longName: string;

  @IsOptional()
  @IsNumber(undefined, { message: CreateDetailValidationMessage.normOfMinute.invalidFormat })
  public normOfMinute: number;

  @IsOptional()
  @IsString({message: CreateDetailValidationMessage.customer.invalidFormat})
  public customer: string;
}
