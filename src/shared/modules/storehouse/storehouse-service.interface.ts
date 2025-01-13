import { DocumentType } from '@typegoose/typegoose';
import { StoreHouseEntity } from './index.js';
import { UpdateStoreHouseDto } from './index.js';

import { CreateStoreHouseDto } from './index.js';
import { DocumentExists } from '../../libs/rest/index.js';

export interface StoreHouseServiceInterface extends DocumentExists {
  find(): Promise<DocumentType<StoreHouseEntity>[] | null>;
  create(dto: CreateStoreHouseDto): Promise<DocumentType<StoreHouseEntity>>;
  updateById(dto: UpdateStoreHouseDto, positionId: string): Promise<DocumentType<StoreHouseEntity> | null>;
  deleteById(positionId: string): Promise<void>;
  incrementCurrentQuantity(positionId: string, incomingQuantity: number): Promise<boolean>;
  decrementCurrentQuantity(positionId: string, incomingQuantity: number): Promise<boolean>;
}
