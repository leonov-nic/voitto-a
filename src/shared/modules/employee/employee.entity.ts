import { getModelForClass, prop, defaultClasses, modelOptions } from '@typegoose/typegoose';
import { TNameOfJob } from '../../types/index.js';
import { NAMESOFJOB } from '../../types/const.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface EmployeeEntity extends defaultClasses.Base {}

@modelOptions({ schemaOptions: { collection: 'Employees', timestamps: true,} })

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class EmployeeEntity extends defaultClasses.TimeStamps {
  @prop({required: true})
  public familyName: string;

  @prop({required: true, unique: true})
  public registrationNumber: number;

  @prop({type: String, enum: NAMESOFJOB, required: true})
  public mainJob: TNameOfJob;

  @prop({default: false})
  public deleted: boolean;

  @prop({required: true})
  public masterId: string;
}

export const EmployeeModel = getModelForClass(EmployeeEntity);
