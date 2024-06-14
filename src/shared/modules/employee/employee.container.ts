import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Controller } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';

import { DefaultEmployeeService, EmployeeModel, EmployeeEntity, EmployeeService, EmployeeController } from './index.js';


export function createEmployeeContainer() {
  const employeeContainer = new Container();
  employeeContainer.bind<EmployeeService>(Component.EmployeeService).to(DefaultEmployeeService);
  employeeContainer.bind<types.ModelType<EmployeeEntity>>(Component.EmployeeModel).toConstantValue(EmployeeModel);
  employeeContainer.bind<Controller>(Component.EmployeeController).to(EmployeeController).inSingletonScope();
  return employeeContainer;
}
