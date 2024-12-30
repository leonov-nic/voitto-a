import { DocumentType } from '@typegoose/typegoose';
import { StoreHouseOperationEntity, CreateStoreHouseOperationDto } from './index.js';

import { DocumentExists } from '../../libs/rest/index.js';

export interface StoreHouseOperationServiceInterface extends DocumentExists {
  find(): Promise<DocumentType<StoreHouseOperationEntity>[] | null>;
  create(dto: CreateStoreHouseOperationDto): Promise<DocumentType<StoreHouseOperationEntity>>;
  deleteById(operationId: string): Promise<void>;
}
