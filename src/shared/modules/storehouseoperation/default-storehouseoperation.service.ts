import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { PipelineStage } from 'mongoose';
import { SortType } from '../../types/index.js';

import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

import { StoreHouseOperationEntity, StoreHouseOperationServiceInterface, CreateStoreHouseOperationDto } from './index.js';


@injectable()
export class DefaultStoreHouseOperationService implements StoreHouseOperationServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.StoreHouseOperationModel) private readonly storeHouseOperationModel: types.ModelType<StoreHouseOperationEntity>,
  ) {}

  public async find(): Promise<DocumentType<StoreHouseOperationEntity>[] | null> {
    const aggregationPipeline: PipelineStage[] = [
      { $sort: { createdAt: SortType.Down } },
      { $addFields: { _id: { $toString: '$_id' } } }
    ];
    const result = await this.storeHouseOperationModel.aggregate(aggregationPipeline).exec();
    return result;
  }

  public async create(dto: CreateStoreHouseOperationDto): Promise<DocumentType<StoreHouseOperationEntity>> {
    const result = await this.storeHouseOperationModel.create(dto);
    this.logger.info(`New operation: ${dto.typeOperation} created`);
    return result;
  }

  public async deleteById(operationId: string): Promise<void> {
    await this.storeHouseOperationModel.deleteOne({_id: operationId}).exec();
    this.logger.info(`Delete operation: ${operationId}`);
  }

  public async exists(operationId: string): Promise<boolean> {
    return (await this.storeHouseOperationModel.exists({_id: operationId})) !== null;
  }
}
