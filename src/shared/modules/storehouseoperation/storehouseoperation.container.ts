import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Controller } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';

import { DefaultStoreHouseOperationService, StoreHouseOperationModel, StoreHouseOperationEntity, StoreHouseOperationServiceInterface, StoreHouseOperationController } from './index.js';

export function createStoreHouseOperationContainer() {
  const storeHouseOperationContainer = new Container();
  storeHouseOperationContainer.bind<StoreHouseOperationServiceInterface>(Component.StoreHouseOperationService).to(DefaultStoreHouseOperationService);
  storeHouseOperationContainer.bind<types.ModelType<StoreHouseOperationEntity>>(Component.StoreHouseOperationModel).toConstantValue(StoreHouseOperationModel);
  storeHouseOperationContainer.bind<Controller>(Component.StoreHouseOperationController).to(StoreHouseOperationController).inSingletonScope();
  return storeHouseOperationContainer;
}
