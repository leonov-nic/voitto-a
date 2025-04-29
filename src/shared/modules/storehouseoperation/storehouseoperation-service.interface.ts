import { DocumentType } from '@typegoose/typegoose';
import { StoreHouseOperationEntity, CreateStoreHouseOperationDto } from './index.js';
import { QueryStorehouseOperations, StatisticsOfOperations } from '../../types/index.js';
import { DocumentExists } from '../../libs/rest/index.js';

export interface StoreOperationsResponse {
  items: DocumentType<StoreHouseOperationEntity>[];
  totalItems: number;
}

export interface StoreHouseOperationServiceInterface extends DocumentExists {
  find(query: QueryStorehouseOperations): Promise<StoreOperationsResponse | null>;
  create(dto: CreateStoreHouseOperationDto): Promise<DocumentType<StoreHouseOperationEntity>>;
  deleteById(operationId: string): Promise<void>;
  getStatisticsOfOperations(): Promise<StatisticsOfOperations[]>;
}
