import { IsString, IsNumber, IsOptional, IsMongoId, IsEnum } from 'class-validator';
import { TypeOperation } from '../../../types/index.js';

export class CreateStoreHouseOperationDto {
  @IsMongoId({message: 'productId is no mongo ID'})
  public productId: string;

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

  @IsString()
  public fromWhom: string;

  @IsString()
  public comment: string;
}
