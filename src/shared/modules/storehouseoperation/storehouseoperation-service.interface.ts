import { DocumentType } from '@typegoose/typegoose';
import { StoreHouseOperationEntity, CreateStoreHouseOperationDto } from './index.js';
import { QueryStorehouseOperations } from '../../types/index.js';
import { DocumentExists } from '../../libs/rest/index.js';

export interface StoreHouseOperationServiceInterface extends DocumentExists {
  find(query: QueryStorehouseOperations): Promise<DocumentType<StoreHouseOperationEntity>[] | null>;
  create(dto: CreateStoreHouseOperationDto): Promise<DocumentType<StoreHouseOperationEntity>>;
  deleteById(operationId: string): Promise<void>;
}
