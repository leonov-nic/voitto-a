import { DocumentType } from '@typegoose/typegoose';
import { EmployeeEntity } from './index.js';

import { CreateEmployeeDto, UpdateEmployeeDto } from './index.js';
import { DocumentExists, IsDocumentAuthor } from '../../libs/rest/index.js';

export interface EmployeeService extends DocumentExists, IsDocumentAuthor {
  find(): Promise<DocumentType<EmployeeEntity>[] | null>;
  create(dto: CreateEmployeeDto): Promise<DocumentType<EmployeeEntity>>;
  deleteById(employeeId: string): Promise<DocumentType<EmployeeEntity> | null>;
  updateById(dto: UpdateEmployeeDto, employeeId: string): Promise<DocumentType<EmployeeEntity> | null>;
  recoveryById(employeeId: string): Promise<DocumentType<EmployeeEntity> | null>;
}
