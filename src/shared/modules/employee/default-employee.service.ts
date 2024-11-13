import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { PipelineStage } from 'mongoose';
import { SortType } from '../../types/index.js';

import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

import { EmployeeEntity, EmployeeService, CreateEmployeeDto, UpdateEmployeeDto } from './index.js';
import { UserEntity } from '../user/user.entity.js';


@injectable()
export class DefaultEmployeeService implements EmployeeService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.EmployeeModel) private readonly employeeModel: types.ModelType<EmployeeEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async find(): Promise<DocumentType<EmployeeEntity>[] | null> {
    const aggregationPipeline: PipelineStage[] = [
      { $match: { deleted: false } },
      { $sort: { createdAt: SortType.Down } },
      { $addFields: { _id: { $toString: '$_id' } } }
    ];
    const result = await this.employeeModel.aggregate(aggregationPipeline).exec();
    return result;
  }

  public async create(dto: CreateEmployeeDto): Promise<DocumentType<EmployeeEntity>> {
    const dtoWithDeletedKey = { ...dto, deleted: false };
    const result = await this.employeeModel.create(dtoWithDeletedKey);
    this.logger.info(`New employee: ${dto.familyName} created`);
    return result;
  }

  public async updateById(dto: UpdateEmployeeDto, employeeId: string): Promise<DocumentType<EmployeeEntity> | null> {
    return this.employeeModel
      .findOneAndUpdate({_id: employeeId}, dto, {new: true})
      .exec();
  }


  public async deleteById(employeeId: string): Promise<DocumentType<EmployeeEntity> | null> {
    const employee = await this.employeeModel.findOne({ _id: employeeId }).exec();

    if (employee) {
      employee.deleted = !employee.deleted;
      await employee.save();
    }
    this.logger.info(`Employee: ${employee?.familyName} deleted`);
    return employee;
  }

  // public async deleteById(employeeId: string): Promise<DocumentType<EmployeeEntity> | null> {
  //   const result = this.employeeModel
  //     .findByIdAndDelete(employeeId)
  //     .exec();
  //   return (await result).value;
  // }

  public async exists(employeeId: string): Promise<boolean> {
    return (await this.employeeModel.exists({_id: employeeId})) !== null;
  }

  public async isAuthor(userId: string, documentId: string): Promise<boolean> {
    const employee = await this.employeeModel.findById(documentId);
    const user = await this.userModel.findById(userId);
    return employee?.masterId.toString() === userId || user?.type === 'admin';
  }
}
