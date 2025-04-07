import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import {
  BaseController,
  HttpMethod,
  ValidateDtoMiddleware,
  PrivateRouteMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { StoreHouseOperationServiceInterface, CreateStoreHouseOperationDto, StoreHouseOperationRdo } from './index.js';

import { fillDTO } from '../../helpers/index.js';
import { QueryStorehouseOperations } from '../../types/index.js';

export type OperationRequest = Request<
  ParamsDictionary,
  unknown,
  unknown,
  QueryStorehouseOperations
>;


@injectable()
export class StoreHouseOperationController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.StoreHouseOperationService) protected readonly storeHouseOperationService: StoreHouseOperationServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for StoreHouseOperationController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new PrivateRouteMiddleware,
      ],
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateDtoMiddleware(CreateStoreHouseOperationDto),
      ],
    });

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware,
      ]
    });
  }

  public async index({query}: OperationRequest, res: Response): Promise<void> {
    const {page, limit, typeProduct, type, createdAt} = query;
    const newquery = {
      page: Number(page),
      limit: Number(limit),
      type,
      typeProduct,
      createdAt: createdAt
    };
    const operations = await this.storeHouseOperationService.find(newquery);
    const result = {
      items: fillDTO(StoreHouseOperationRdo, operations?.items),
      totalItems: operations?.totalItems,
    }
    this.created(res, result);
  }

  public async create(req: Request, res: Response): Promise<void> {
    const details = await this.storeHouseOperationService.create(req.body);
    this.created(res, fillDTO(StoreHouseOperationRdo, details));
  }

  public async delete({ params }: Request, res: Response): Promise<void> {
    const deletedOperation = await this.storeHouseOperationService.deleteById(params.id);
    this.noContent(res, fillDTO(StoreHouseOperationRdo, deletedOperation));
  }
}
