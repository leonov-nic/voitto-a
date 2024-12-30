import { getModelForClass, prop, defaultClasses, modelOptions } from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface StoreHouseEntity extends defaultClasses.Base {}

@modelOptions({ schemaOptions: { collection: 'Storehouse', timestamps: true,} })

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class StoreHouseEntity extends defaultClasses.TimeStamps {
  @prop({required: true})
  public name: string;

  @prop({required: true})
  public company: string;

  @prop({default: ''})
  public characteristics: string;

  @prop({default: null})
  public size: number;

  @prop({default: null})
  public diameter: number;

  @prop({required: true})
  public type: string;

  @prop({default: null})
  public price: number;

  @prop({default: true})
  public isActive: boolean;

  @prop({default: 0})
  public currentQuantity: number;
}

export const StoreHouseModel = getModelForClass(StoreHouseEntity);
