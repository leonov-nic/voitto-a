import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { PipelineStage } from 'mongoose';
import { SortType } from '../../types/index.js';

import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

import { StoreHouseEntity, StoreHouseServiceInterface, CreateStoreHouseDto, UpdateStoreHouseDto } from './index.js';


@injectable()
export class DefaultStoreHouseService implements StoreHouseServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.StoreHouseModel) private readonly storeHouseModel: types.ModelType<StoreHouseEntity>,
  ) {}

  public async find(): Promise<DocumentType<StoreHouseEntity>[] | null> {
    const aggregationPipeline: PipelineStage[] = [
      { $sort: { createdAt: SortType.Down } },
      { $addFields: { _id: { $toString: '$_id' } } }
    ];
    const result = await this.storeHouseModel.aggregate(aggregationPipeline).exec();
    return result;
  }

  public async create(dto: CreateStoreHouseDto): Promise<DocumentType<StoreHouseEntity>> {
    const result = await this.storeHouseModel.create(dto);
    this.logger.info(`New position: ${dto.name} created`);
    return result;
  }

  public async updateById(dto: UpdateStoreHouseDto, positionId: string): Promise<DocumentType<StoreHouseEntity> | null> {
    return this.storeHouseModel
      .findOneAndUpdate({_id: positionId}, dto, {new: true})
      .exec();
  }

  public async deleteById(positionId: string): Promise<void> {
    await this.storeHouseModel.deleteOne({_id: positionId}).exec();
  }

  public async exists(positionId: string): Promise<boolean> {
    return (await this.storeHouseModel.exists({_id: positionId})) !== null;
  }
}
