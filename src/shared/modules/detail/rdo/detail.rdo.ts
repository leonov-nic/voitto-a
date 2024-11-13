import { Expose } from 'class-transformer';

export class DetailRdo {
  @Expose()
  public _id: string;

  @Expose()
  public shortName: string;

  @Expose()
  public longName: string;

  @Expose()
  public normOfMinute: number;

  @Expose()
  public customer: number;
}
