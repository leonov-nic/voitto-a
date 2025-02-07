import { getModelForClass, prop, defaultClasses, modelOptions, Ref } from '@typegoose/typegoose';
import { EmployeeEntity } from '../employee/employee.entity.js';
import { StoreHouseEntity } from '../storehouse/storehouse.entity.js';
import { TypeOperation } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface StoreHouseOperationEntity extends defaultClasses.Base {}

@modelOptions({ schemaOptions: { collection: 'Storehouseoperation', timestamps: true,} })

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class StoreHouseOperationEntity extends defaultClasses.TimeStamps {
  @prop({ref: StoreHouseEntity, _id: false, required: true})
  public productId: Ref<StoreHouseEntity>;

  @prop()
  public currentQuantityProduct: number = 0;

  @prop({ref: EmployeeEntity, _id: false})
  public employeeId: Ref<EmployeeEntity>;

  @prop()
  public box: number;

  @prop({required: true})
  public amount: number;

  @prop()
  public totalAmount: number;

  @prop({type: String, enum: TypeOperation, required: true})
  public typeOperation: string;

  @prop()
  public fromWhom: string;

  @prop()
  public comment: string;
}

export const StoreHouseOperationModel = getModelForClass(StoreHouseOperationEntity);
