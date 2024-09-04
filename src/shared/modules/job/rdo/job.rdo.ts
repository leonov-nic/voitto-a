import { Expose, Type } from 'class-transformer';
import { DetailRdo } from '../../detail/index.js';
import { UserRdo } from '../../user/index.js';

export class JobRdo {
  @Expose()
  public _id: string;

  @Expose()
  public createdAt: Date;

  @Expose()
  public employee: unknown;

  @Expose()
  public employeeId: string;

  @Expose()
  public timeFrom: string;

  @Expose()
  public timeTo: string;

  @Expose()
  public totalHours: string;

  @Expose()
  public detailId: string;

  @Expose({ name: 'detail'})
  @Type(() => DetailRdo)
  public detail: DetailRdo;

  @Expose()
  public typeOfJob: string;

  @Expose()
  public extra: number;

  @Expose()
  public quantity: number;

  @Expose()
  public comment: string;

  @Expose({ name: 'master'})
  @Type(() => UserRdo)
  public master: UserRdo;

  @Expose()
  public count: number;
}
