import { IsOptional} from 'class-validator';

export class UpdateStoreHouseDto {
  @IsOptional()
  public name: string;

  @IsOptional()
  public company: string;

  @IsOptional()
  public characteristics: string;

  @IsOptional()
  public size: number;

  @IsOptional()
  public diameter: number;

  @IsOptional()
  public type: string;

  @IsOptional()
  public price: number;

  @IsOptional()
  public isActive: boolean;

  @IsOptional()
  public currentQuantity: number;
}

