import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { PipelineStage } from 'mongoose';

import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../libs/rest/http.error.js';

import { SortType, Component, TypeOperation } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

import { StoreHouseOperationEntity, StoreHouseOperationServiceInterface, CreateStoreHouseOperationDto } from './index.js';
// import { StoreHouseEntity } from '../storehouse/index.js';
import { StoreHouseServiceInterface } from '../storehouse/index.js';

@injectable()
export class DefaultStoreHouseOperationService implements StoreHouseOperationServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.StoreHouseOperationModel) private readonly storeHouseOperationModel: types.ModelType<StoreHouseOperationEntity>,
    @inject(Component.StoreHouseService) private readonly storeHouseService: StoreHouseServiceInterface,
  ) {}

  public async find(): Promise<DocumentType<StoreHouseOperationEntity>[] | null> {
    const aggregationProduct: PipelineStage[] = [
      {
        $lookup: {
          from: 'Storehouse',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product'
      },
      {
        $project: {
          'product._id': 0,
          'product.updatedAt': 0,
          'product.__v': 0,
          'product.createdAt': 0,
          'product.company': 0,
          'product.characteristics': 0,
          'product.price': 0,
        }
      },
    ];

    const aggregationEmployee: PipelineStage[] = [
      {
        $addFields: {
          employee: {
            $cond: {
              if: { $eq: ['$employeeId', null] },
              then: null,
              else: '$employee'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'Employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee',
        },
      },
      {
        $unwind: {
          path: '$employee',
          preserveNullAndEmptyArrays: true // сохраняем null, если employeeId равен null
        }
      },
      {
        $project: {
          'employee._id': 0,
          'employee.updatedAt': 0,
          'employee.__v': 0,
          'employee.createdAt': 0,
          'employee.masterId': 0,
        }
      },
    ];

    const aggregationPipeline: PipelineStage[] = [
      { $sort: { createdAt: SortType.Down } },
      { $addFields: { _id: { $toString: '$_id' } } }
    ];
    const result = await this.storeHouseOperationModel.aggregate([...aggregationPipeline, ...aggregationEmployee, ...aggregationProduct]).exec();
    return result;
  }

  public async create(dto: CreateStoreHouseOperationDto): Promise<DocumentType<StoreHouseOperationEntity>> {
    const {typeOperation} = dto;

    const product = await this.storeHouseService.exists(dto.productId);
    if (!product) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Things not found',
      );
    }

    if (typeOperation === TypeOperation.Arrival) {
      await this.storeHouseService.incrementCurrentQuantity(dto.productId, dto.totalAmount);
    }
    if (typeOperation === TypeOperation.Shipment) {
      await this.storeHouseService.decrementCurrentQuantity(dto.productId, dto.totalAmount);
    }

    const result = await this.storeHouseOperationModel.create(dto);
    this.logger.info(`New operation: ${dto.typeOperation} created`);
    return result;
  }

  public async deleteById(operationId: string): Promise<void> {
    const operation = await this.storeHouseOperationModel.findById({_id: operationId})
    if (!operation) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Operation not found',
      );
    }
    await this.storeHouseOperationModel.deleteOne({_id: operationId}).exec();
    if (operation.typeOperation === TypeOperation.Arrival) {
      await this.storeHouseService.decrementCurrentQuantity(operation.productId.toString(), operation.totalAmount);
    }
    if (operation.typeOperation === TypeOperation.Shipment) {
      await this.storeHouseService.incrementCurrentQuantity(operation.productId.toString(), operation.totalAmount);
    }
    this.logger.info(`Delete operation: ${operationId}`);
  }

  public async exists(operationId: string): Promise<boolean> {
    return (await this.storeHouseOperationModel.exists({_id: operationId})) !== null;
  }
}
