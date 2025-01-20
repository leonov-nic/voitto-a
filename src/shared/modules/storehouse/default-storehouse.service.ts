import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { PipelineStage } from 'mongoose';
import { SortType } from '../../types/index.js';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../libs/rest/http.error.js';

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
      { $match: { isActive: true } },
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
    const position = await this.storeHouseModel.findById(positionId).exec();

    if (!position || !position.isActive) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'No Exist Product'
      );
    }

    await this.storeHouseModel.findOneAndUpdate(
      { _id: positionId },
      { $set: { isActive: false } }
    ).exec();
  }

  public async exists(positionId: string): Promise<boolean> {
    return (await this.storeHouseModel.exists({_id: positionId})) !== null;
  }

  public async isAvailibalCurrentQuantity(positionId: string, incomingQuantity: number): Promise<boolean> {
    const result = await this.storeHouseModel.findOne({ _id: positionId });

    if (!result) {return false}
    if (incomingQuantity > result.currentQuantity) {return false;}
    return true;
  }

  public async incrementCurrentQuantity(positionId: string, incomingQuantity: number): Promise<boolean> {
    const product = await this.exists(positionId);

    if (!product) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'No Exist Product',
      );
    }

    const result = await this.storeHouseModel.updateOne(
      { _id: positionId },
      { $inc: { currentQuantity: Number(incomingQuantity) } }
    );
    return result.modifiedCount > 0;
  }

  public async decrementCurrentQuantity(positionId: string, incomingQuantity: number): Promise<boolean> {
    const product = await this.exists(positionId);

    if (!product) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'No Exist Product',
      );
    }

    const availibalCurrentQuantity = await this.isAvailibalCurrentQuantity(positionId, incomingQuantity);

    if (availibalCurrentQuantity) {
      const result = await this.storeHouseModel.updateOne(
        { _id: positionId },
        { $inc: { currentQuantity: -Number(incomingQuantity) } }
      );
      return result.modifiedCount > 0;
    }

    throw new HttpError(
      StatusCodes.CONFLICT,
      `Quantity of things less of exist`,
    );
  }
}
