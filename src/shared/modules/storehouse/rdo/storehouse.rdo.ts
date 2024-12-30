import { Expose } from 'class-transformer';

export class StoreHouseRdo {
  @Expose()
  public _id: string;

  @Expose()
  public name: string;

  @Expose()
  public company: string;

  @Expose()
  public characteristics: string;

  @Expose()
  public size: number;

  @Expose()
  public diameter: number;

  @Expose()
  public type: string;

  @Expose()
  public price: number;

  @Expose()
  public currentQuantity: number;
}
