import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Controller } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';

import { DefaultStoreHouseService, StoreHouseModel, StoreHouseEntity, StoreHouseServiceInterface, StoreHouseController } from './index.js';

export function createStoreHouseContainer() {
  const storeHouseContainer = new Container();
  storeHouseContainer.bind<StoreHouseServiceInterface>(Component.StoreHouseService).to(DefaultStoreHouseService);
  storeHouseContainer.bind<types.ModelType<StoreHouseEntity>>(Component.StoreHouseModel).toConstantValue(StoreHouseModel);
  storeHouseContainer.bind<Controller>(Component.StoreHouseController).to(StoreHouseController).inSingletonScope();
  return storeHouseContainer;
}
