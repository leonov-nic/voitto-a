import { IsOptional} from 'class-validator';
import { TNameOfJob } from '../../../types/index.js';

export class UpdateEmployeeDto {

  @IsOptional()
  public familyName: string;

  @IsOptional()
  public registrationNumber: number;

  @IsOptional()
  public mainJob: TNameOfJob;

  @IsOptional()
  public masterId: string;
}
