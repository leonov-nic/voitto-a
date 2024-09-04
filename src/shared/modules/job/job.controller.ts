import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  HttpMethod,
  ValidateObjectIdMiddleware,
  ValidateAuthorsMiddleware,
  ValidateDtoMiddleware,
  DocumentExistsMiddleware,
  PrivateRouteMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { JobService, CreateJobDto, JobRdo, UpdateJobDto } from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { ParamsDictionary } from 'express-serve-static-core';

export type ParamJobId = {
  id: string;
} | ParamsDictionary;

export type RequestQuery = {
  createdAt?: string;
  limit?: number;
  offset?: number;
  filterByMonth?: boolean;
}

@injectable()
export class JobController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.JobService) protected readonly jobService: JobService,
  ) {
    super(logger);
    this.logger.info('Register routes for JobController...');

    this.addRoute({
      // path: '/?createdAt=:createdAt&limit=:limit',
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
        new ValidateDtoMiddleware(CreateJobDto),
      ],
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.jobService, 'job', 'id'),
        new ValidateAuthorsMiddleware(this.jobService, 'Job', 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateDtoMiddleware(UpdateJobDto),
        new ValidateAuthorsMiddleware(this.jobService, 'Job', 'id')
      ]
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const userId = req.tokenPayload.id;
    const {offset, limit, createdAt, filterByMonth} = req.query
    const newOffset = Number(offset);
    const newLimit = Number(limit);
    const newQuery = {...req.query, offset: newOffset, limit: newLimit, createdAt, filterByMonth}
    const jobs = await this.jobService.find(newQuery, userId);
    this.ok(res, fillDTO(JobRdo, jobs));
  }

  public async create({ body, tokenPayload }: Request, res: Response): Promise<void> {
    const job = await this.jobService.create({...body, master: tokenPayload.id});
    this.created(res, fillDTO(JobRdo, job));
    this.logger.info(`Created job of master ${tokenPayload.id}`);
  }

  public async delete({ params }: Request<ParamJobId>, res: Response): Promise<void> {
    const deletedJob = await this.jobService.deleteById(params.id);
    this.noContent(res, deletedJob);
    this.logger.info('Job is deleted');
  }

  public async update({ body, params, tokenPayload }: Request, res: Response): Promise<void> {
    const updatedJob = await this.jobService.updateById(body, params.id);
    this.ok(res, fillDTO(UpdateJobDto, updatedJob));
    this.logger.info(`Job is updated for ${body.employee} of master ${tokenPayload.id}`);
  }
}
