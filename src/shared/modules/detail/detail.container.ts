import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Controller } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';

import { DefaultDetailService, DetailModel, DetailEntity, DetailService, DetailController } from './index.js';


export function createDetailContainer() {
  const detailContainer = new Container();
  detailContainer.bind<DetailService>(Component.DetailService).to(DefaultDetailService);
  detailContainer.bind<types.ModelType<DetailEntity>>(Component.DetailModel).toConstantValue(DetailModel);
  detailContainer.bind<Controller>(Component.DetailController).to(DetailController).inSingletonScope();
  return detailContainer;
}
