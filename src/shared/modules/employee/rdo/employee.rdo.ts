import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/index.js';

export class EmployeeRdo {
  @Expose()
  public _id: string;

  @Expose()
  public familyName: string;

  @Expose()
  public registrationNumber: number;

  @Expose()
  public mainJob: string;

  @Expose({ name: 'masterId'})
  @Type(() => UserRdo)
  public masterId: UserRdo;
}
