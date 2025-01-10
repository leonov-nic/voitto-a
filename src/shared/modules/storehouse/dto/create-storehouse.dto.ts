import { CreateStoreHouseValidationMessage } from './storehouse-validation-message.js';
import { IsString, IsNumber, IsOptional, IsBoolean, ValidateIf } from 'class-validator';

export class CreateStoreHouseDto {
  @IsString({message: CreateStoreHouseValidationMessage.name.invalidFormat })
  public name: string;

  @IsOptional()
  @IsString({ message: CreateStoreHouseValidationMessage.company.invalidFormat })
  public company: string;

  @ValidateIf(o => o.characteristics != null)
  @IsOptional()
  @IsString({message: CreateStoreHouseValidationMessage.characteristics.invalidFormat})
  public characteristics: string;

  @ValidateIf(o => o.size != null)
  @IsOptional()
  @IsString({ message: CreateStoreHouseValidationMessage.size.invalidFormat })
  public size: string;

  @ValidateIf(o => o.diameter != null)
  @IsOptional()
  @IsNumber(undefined, { message: CreateStoreHouseValidationMessage.diameter.invalidFormat })
  public diameter: number;

  @ValidateIf(o => o.type != null)
  @IsOptional()
  @IsString({message: CreateStoreHouseValidationMessage.type.invalidFormat})
  public type: string;

  @ValidateIf(o => o.price != null)
  @IsOptional()
  @IsNumber(undefined, {message: CreateStoreHouseValidationMessage.price.invalidFormat})
  public price: number;

  @IsOptional()
  @IsBoolean({})
  public isActive: boolean;

  @IsOptional()
  @IsNumber()
  public currentQuantity: number;
}

