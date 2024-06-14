import { IsOptional} from 'class-validator';

export class UpdateJobDto {
  @IsOptional()
  public employeeId?: string;

  @IsOptional()
  public timeFrom?: string;

  @IsOptional()
  public timeTo?: string;

  @IsOptional()
  public detailId?: string;

  @IsOptional()
  public typeOfJob?: string;

  @IsOptional()
  public extra?: number;

  @IsOptional()
  public quantity?: number;

  @IsOptional()
  public comment?: string;

  @IsOptional()
  public master?: string;

  @IsOptional()
  public createdAt?: string;
}
