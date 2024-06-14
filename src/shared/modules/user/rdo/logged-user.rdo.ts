import { Expose } from 'class-transformer';

export class LoggedUserRdo {
  @Expose()
  public token: string;

  @Expose()
  public email: string;

  @Expose()
  public name: string;

  @Expose()
  public type: string;

  @Expose()
  public avatar: string;

  @Expose()
  public _id: string;
}
