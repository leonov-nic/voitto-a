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
import { DetailService, CreateDetailDto, DetailRdo } from './index.js';
import { UpdateDetailDto } from './dto/update-detail.dto.js';

import { fillDTO } from '../../helpers/index.js';
import { RequestBody } from '../../types/index.js';

export type CreateeDetailRequest = Request<
  RequestBody,
  CreateDetailDto
>;


@injectable()
export class DetailController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.DetailService) protected readonly detailService: DetailService,
  ) {
    super(logger);
    this.logger.info('Register routes for DetailController...');

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
        new ValidateDtoMiddleware(CreateDetailDto),
      ],
    });

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateDtoMiddleware(UpdateDetailDto),
      ]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const details = await this.detailService.find();
    this.created(res, fillDTO(DetailRdo, details));
  }

  public async create({ body }: CreateeDetailRequest, res: Response): Promise<void> {
    const details = await this.detailService.create(body);
    this.created(res, fillDTO(DetailRdo, details));
    this.logger.info(`Created new detail ${body.shortName}`);
  }

  public async update({ body, params }: Request, res: Response): Promise<void> {
    const updatedDetail = await this.detailService.updateById(body, params.id);
    this.ok(res, fillDTO(UpdateDetailDto, updatedDetail));
    this.logger.info(`Updated for detail ${body.shortName}`);
  }
}
