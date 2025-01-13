import { IsString, IsNumber, IsOptional, IsMongoId, IsEnum, ValidateIf } from 'class-validator';
import { TypeOperation } from '../../../types/index.js';

export class CreateStoreHouseOperationDto {
  @IsMongoId({message: 'productId is no mongo ID'})
  public productId: string;

  @ValidateIf(o => o.employeeId != null)
  @IsOptional()
  @IsMongoId({message: 'employeeId is no mongo ID'})
  public employeeId: string;

  @IsOptional()
  @IsNumber()
  public box: number;

  @IsNumber()
  public amount: number;

  @IsOptional()
  @IsNumber()
  public totalAmount: number;

  @IsEnum(TypeOperation)
  public typeOperation: TypeOperation;

  @IsOptional()
  @IsString()
  public fromWhom: string;

  @IsString()
  public comment: string;
}
