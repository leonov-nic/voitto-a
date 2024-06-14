import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { PipelineStage } from 'mongoose';
import { SortType } from '../../types/index.js';

import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

import { DetailEntity, DetailService, CreateDetailDto } from './index.js';


@injectable()
export class DefaultDetailService implements DetailService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.DetailModel) private readonly detailModel: types.ModelType<DetailEntity>,
  ) {}

  public async find(): Promise<DocumentType<DetailEntity>[] | null> {
    const aggregationPipeline: PipelineStage[] = [
      { $sort: { createdAt: SortType.Down } },
      { $addFields: { _id: { $toString: '$_id' } } }
    ];
    const result = await this.detailModel.aggregate(aggregationPipeline).exec();
    return result;
  }

  public async create(dto: CreateDetailDto): Promise<DocumentType<DetailEntity>> {
    const result = await this.detailModel.create(dto);
    this.logger.info(`New detail: ${dto.shortName} created`);
    return result;
  }

  public async exists(detailId: string): Promise<boolean> {
    return (await this.detailModel.exists({_id: detailId})) !== null;
  }
}
