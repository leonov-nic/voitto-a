import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { PipelineStage } from 'mongoose';

import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../libs/rest/http.error.js';

import { SortType, Component, TypeOperation, QueryStorehouseOperations, FilterStorehouseOperations } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

import {
  StoreHouseOperationEntity,
  StoreHouseOperationServiceInterface,
  CreateStoreHouseOperationDto,
  StoreOperationsResponse
} from './index.js';
// import { StoreHouseEntity } from '../storehouse/index.js';
import { StoreHouseServiceInterface } from '../storehouse/index.js';


@injectable()
export class DefaultStoreHouseOperationService implements StoreHouseOperationServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.StoreHouseOperationModel) private readonly storeHouseOperationModel: types.ModelType<StoreHouseOperationEntity>,
    @inject(Component.StoreHouseService) private readonly storeHouseService: StoreHouseServiceInterface,
  ) {}

  public async getStoreOperationsCount(query: QueryStorehouseOperations): Promise<number> {
    const { type, typeProduct, createdAt } = query;
    const filter: FilterStorehouseOperations = {};
    if (type) {
      filter.typeOperation = type;
    }
    if (typeProduct) {
      filter.productType = typeProduct
    }
    if (createdAt) {
      filter.createdAt = createdAt;
    }
    return await this.storeHouseOperationModel.find(filter).count().exec();
  }

  public async getStoreHouseOperationById(id: string): Promise<DocumentType<StoreHouseOperationEntity> | null> {
    return await this.storeHouseOperationModel.findById(id).exec();
  }

  public async find(query: QueryStorehouseOperations): Promise<StoreOperationsResponse | null> {
    const skip = query?.page && query?.limit ? (query.page - 1) * query.limit : 0;
    const limit = query?.limit || 10;
    const typeOperation = query?.type;
    const typeProduct = query?.typeProduct;

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
      ...(typeOperation ? [{ $match: { typeOperation }}] : []),
      ...(typeProduct ? [{ $match: { 'product.type': typeProduct, 'typeOperation': 'Shipment',}}] : []),
      { $sort: { createdAt: SortType.Down }},
      { $addFields: { _id: { $toString: '$_id'}}},
      { $skip: skip },
      { $limit: limit },
    ];

    const [result, storeHouseOperationCount] = await Promise.all([
      await this.storeHouseOperationModel.aggregate([...aggregationEmployee, ...aggregationProduct, ...aggregationPipeline,]).exec(),
      await this.getStoreOperationsCount(query),
    ]);

    return {
      items: result,
      totalItems: storeHouseOperationCount,
    }
  }

  public async create(dto: CreateStoreHouseOperationDto): Promise<DocumentType<StoreHouseOperationEntity>> {
    const { typeOperation, productId } = dto;

    const product = await this.storeHouseService.findById(productId);
    if (!product) {throw new HttpError(StatusCodes.NOT_FOUND, 'Things not found');}

    if (typeOperation === TypeOperation.Arrival) {
      await this.storeHouseService.incrementCurrentQuantity(dto.productId, dto.totalAmount);
    }
    if (typeOperation === TypeOperation.Shipment) {
      await this.storeHouseService.decrementCurrentQuantity(dto.productId, dto.totalAmount);
    }
    const result = await this.storeHouseOperationModel.create({
      ...dto,
      currentQuantityProduct: typeOperation === TypeOperation.Arrival ? Number(product.currentQuantity) + Number(dto.totalAmount) :  Number(product.currentQuantity) - Number(dto.totalAmount),
      productType: typeOperation === TypeOperation.Shipment ? product.type : null,
      fromWhom: typeOperation === TypeOperation.Shipment ? "" : dto.fromWhom,
    });
    this.logger.info(`New operation: ${dto.typeOperation} created`);
    return result;
  }

  public async deleteById(operationId: string): Promise<void> {
    const operation = await this.storeHouseOperationModel.findById({_id: operationId});

    if (!operation) {throw new HttpError(StatusCodes.NOT_FOUND, 'Operation not found',);}

    if (operation.typeOperation === TypeOperation.Arrival) {
      const operationsShipmentAfter = await this.storeHouseOperationModel.find({
        productId: operation?.productId,
        typeOperation: 'Shipment',
        createdAt: { $gt: operation?.createdAt }
      });

      if (operationsShipmentAfter.length > 0) {
        throw new HttpError(StatusCodes.CONFLICT,
        `You must delete all opration Shipment for this item after ${operation.createdAt}`);
      }
      await this.storeHouseOperationModel.deleteOne({_id: operationId}).exec();
      await this.storeHouseService.decrementCurrentQuantity(operation.productId.toString(), operation.totalAmount);
    }
    if (operation.typeOperation === TypeOperation.Shipment) {
      await this.storeHouseOperationModel.deleteOne({_id: operationId}).exec();
      await this.storeHouseService.incrementCurrentQuantity(operation.productId.toString(), operation.totalAmount);
    }
    this.logger.info(`Delete operation: ${operationId}`);
  }

  public async exists(operationId: string): Promise<boolean> {
    return (await this.storeHouseOperationModel.exists({_id: operationId})) !== null;
  }
}
