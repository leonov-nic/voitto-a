import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { DefaultUserService, UserService } from './index.js';
import { Component } from '../../types/index.js';
import { UserEntity, UserModel } from './index.js';
import { Controller } from '../../libs/rest/index.js';
import { UserController } from './index.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainer.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();
  return userContainer;
}
