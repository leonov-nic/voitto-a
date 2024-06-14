import { getModelForClass, prop, defaultClasses, modelOptions } from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface DetailEntity extends defaultClasses.Base {}

@modelOptions({ schemaOptions: { collection: 'Details', timestamps: true,} })

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class DetailEntity extends defaultClasses.TimeStamps {
  @prop({required: true, unique: true})
  public shortName: string;

  @prop({required: true, unique: true})
  public longName: string;

  @prop({})
  public normOfMinute: number;

  @prop({})
  public customer: string;
}

export const DetailModel = getModelForClass(DetailEntity);
