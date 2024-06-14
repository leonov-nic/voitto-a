import { DocumentType } from '@typegoose/typegoose';
import { DetailEntity } from './index.js';

import { CreateDetailDto } from './index.js';
import { DocumentExists } from '../../libs/rest/index.js';

export interface DetailService extends DocumentExists {
  find(): Promise<DocumentType<DetailEntity>[] | null>;
  create(dto: CreateDetailDto): Promise<DocumentType<DetailEntity>>;
}
