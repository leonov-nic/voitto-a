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
import { EmployeeService, CreateEmployeeDto, UpdateEmployeeDto, EmployeeRdo } from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { ParamsDictionary } from 'express-serve-static-core';

import { RequestBody, RequestParams } from '../../types/index.js';

export type ParamEmployeeId = {
  id: string;
} | ParamsDictionary;

export type CreateEmployeeRequest = Request<
  RequestParams,
  RequestBody,
  CreateEmployeeDto
>;


@injectable()
export class EmployeeController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.EmployeeService) protected readonly employeeService: EmployeeService,
  ) {
    super(logger);
    this.logger.info('Register routes for EmployeeController...');

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
        new ValidateDtoMiddleware(CreateEmployeeDto),
      ],
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.employeeService, 'Employee', 'id'),
        new ValidateAuthorsMiddleware(this.employeeService, 'Employee', 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateDtoMiddleware(UpdateEmployeeDto),
        new ValidateAuthorsMiddleware(this.employeeService, 'Employees', 'id')
      ]
    });
    this.addRoute({
      path: '/recovery/:id',
      method: HttpMethod.Patch,
      handler: this.recovery,
      middlewares: [
        new PrivateRouteMiddleware,
        new ValidateAuthorsMiddleware(this.employeeService, 'Employees', 'id')
      ]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const employees = await this.employeeService.find();
    this.created(res, fillDTO(EmployeeRdo, employees));
  }

  public async create({ body, tokenPayload }: CreateEmployeeRequest, res: Response): Promise<void> {
    const employee = await this.employeeService.create({...body, masterId: tokenPayload.id.toString()});
    this.created(res, fillDTO(EmployeeRdo, employee));
    this.logger.info(`Created employee ${body.familyName} of master ${tokenPayload.id}`);
  }

  public async delete({ params }: Request<ParamEmployeeId>, res: Response): Promise<void> {
    const deletedEmployee = await this.employeeService.deleteById(params.id);
    this.noContent(res, deletedEmployee);
    this.logger.info('Employee is deleted');
  }

  public async update({ body, params }: Request, res: Response): Promise<void> {
    const updatedEmployee = await this.employeeService.updateById(body, params.id);
    this.ok(res, fillDTO(UpdateEmployeeDto, updatedEmployee));
    this.logger.info(`Employee is updated for ${body.familyName}`);
  }

  public async recovery({ params }: Request, res: Response): Promise<void> {
    const recoveryEmployee = await this.employeeService.recoveryById(params.id);
    this.ok(res, fillDTO(UpdateEmployeeDto, recoveryEmployee));
    this.logger.info(`Employee ${recoveryEmployee?.familyName} is recovered`);
  }
}
