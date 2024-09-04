import { DocumentType } from '@typegoose/typegoose';
import { JobEntity } from './index.js';

import { CreateJobDto, UpdateJobDto } from './index.js';
import { DocumentExists, IsDocumentAuthor} from '../../libs/rest/index.js';

export interface JobService extends DocumentExists, IsDocumentAuthor {
  find(params: {limit?: number, offset?: number}, userId: string): Promise<DocumentType<JobEntity>[] | null>;
  create(dto: CreateJobDto): Promise<DocumentType<JobEntity>>;
  deleteById(jobId: string): Promise<DocumentType<JobEntity> | null>;
  updateById(dto: UpdateJobDto, jobId: string): Promise<DocumentType<JobEntity> | null>;
}
