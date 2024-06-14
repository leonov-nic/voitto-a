import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
import { EmployeeEntity } from '../employee/index.js';
import { DetailEntity } from '../detail/index.js';
import { TNameOfJob } from '../../types/index.js';
import { NAMESOFJOB } from '../../types/const.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface JobEntity extends defaultClasses.Base {}

@modelOptions({schemaOptions: {collection: 'Jobs'}})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class JobEntity extends defaultClasses.TimeStamps {
  @prop({ref: EmployeeEntity, _id: false})
  public employeeId: Ref<EmployeeEntity>;

  @prop({required: true, trim: true})
  public timeFrom: string;

  @prop({required: true, trim: true})
  public timeTo: string;

  @prop({type: String, enum: NAMESOFJOB, required: true})
  public typeOfJob: TNameOfJob;

  @prop({ref: DetailEntity, _id: false})
  public detailId: Ref<DetailEntity>;

  @prop({required: true, default: 0, min: 0, max: 300})
  public quantity: number;

  @prop({ref: UserEntity, _id: false})
  public master: Ref<UserEntity>;

  @prop({trim: true})
  public comment?: string;

  @prop({default: null, min: null, max: 300})
  public extra?: number;
}

export const JobModel = getModelForClass(JobEntity);
