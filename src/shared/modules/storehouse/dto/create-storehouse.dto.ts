import { CreateStoreHouseValidationMessage } from './storehouse-validation-message.js';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateStoreHouseDto {
  @IsString({message: CreateStoreHouseValidationMessage.name.invalidFormat })
  public name: string;

  @IsOptional()
  @IsString({ message: CreateStoreHouseValidationMessage.company.invalidFormat })
  public company: string;

  @IsOptional()
  @IsString({message: CreateStoreHouseValidationMessage.characteristics.invalidFormat})
  public characteristics: string;

  @IsOptional()
  @IsNumber(undefined, { message: CreateStoreHouseValidationMessage.size.invalidFormat })
  public size: number;

  @IsOptional()
  @IsNumber(undefined, { message: CreateStoreHouseValidationMessage.diameter.invalidFormat })
  public diameter: number;

  @IsOptional()
  @IsString({message: CreateStoreHouseValidationMessage.type.invalidFormat})
  public type: string;

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

