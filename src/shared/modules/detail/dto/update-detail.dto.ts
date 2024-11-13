import { IsOptional} from 'class-validator';

export class UpdateDetailDto {
  @IsOptional()
  public shortName: string;

  @IsOptional()
  public longName: string;

  @IsOptional()
  public normOfMinute: number;

  @IsOptional()
  public customer: string;
}
