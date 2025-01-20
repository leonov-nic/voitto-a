import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  HttpMethod,
  ValidateDtoMiddleware,
  PrivateRouteMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { StoreHouseServiceInterface, CreateStoreHouseDto, UpdateStoreHouseDto, StoreHouseRdo } from './index.js';

import { fillDTO } from '../../helpers/index.js';
import { RequestBody } from '../../types/index.js';

export type CreateeStoreHouseRequest = Request<
  RequestBody,
  CreateStoreHouseDto
>;


@injectable()
export class StoreHouseController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.StoreHouseService) protected readonly storeHouseService: StoreHouseServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for StoreHouseController...');

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
        new ValidateDtoMiddleware(CreateStoreHouseDto),
      ],
    });

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateDtoMiddleware(UpdateStoreHouseDto),
      ]
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

  public async index(_req: Request, res: Response): Promise<void> {
    const products = await this.storeHouseService.find();
    this.created(res, fillDTO(StoreHouseRdo, products));
  }

  public async create({ body }: CreateeStoreHouseRequest, res: Response): Promise<void> {
    const details = await this.storeHouseService.create(body);
    this.created(res, fillDTO(StoreHouseRdo, details));
  }

  public async update({ body, params }: Request, res: Response): Promise<void> {
    const updatedProduct= await this.storeHouseService.updateById(body, params.id);
    this.ok(res, fillDTO(UpdateStoreHouseDto, updatedProduct));
    this.logger.info(`Updated for product ${body.name}`);
  }

  public async delete({ params }: Request, res: Response): Promise<void> {
    const deletedProduct= await this.storeHouseService.deleteById(params.id);
    this.noContent(res, fillDTO(UpdateStoreHouseDto, deletedProduct));
    this.logger.info(`Delete product by id ${params.id}`);
  }
}
