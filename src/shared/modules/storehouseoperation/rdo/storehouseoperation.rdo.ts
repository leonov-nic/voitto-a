import { Expose } from 'class-transformer';

export class StoreHouseOperationRdo {
  @Expose()
  public id: string;

  @Expose()
  public productId: string;

  @Expose()
  public employeeId: string;

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
