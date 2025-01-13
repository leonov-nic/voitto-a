import { Expose, Type } from 'class-transformer';
import { EmployeeRdo } from '../../employee/index.js';
import { StoreHouseRdo } from '../../storehouse/index.js';

export class StoreHouseOperationRdo {
  @Expose()
  public _id: string;

  @Expose()
  public createdAt: string;

  @Expose()
  public productId: string;

  @Expose({ name: 'product'})
  @Type(() => StoreHouseRdo)
  public product: StoreHouseRdo;

  @Expose()
  public employeeId: string;

  @Expose({ name: 'employee'})
  @Type(() => EmployeeRdo)
  public employee: EmployeeRdo;

  @Expose()
  public box: number;

  @Expose()
  public amount: number;

  @Expose()
  public totalAmount: number;

  @Expose()
  public typeOperation: string;

  @Expose()
  public fromWhom: string;

  @Expose()
  public comment: string;
}
