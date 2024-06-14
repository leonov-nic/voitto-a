import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Controller } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';

import { DefaultJobService, JobService, JobController } from './index.js';
import { JobEntity, JobModel } from './job.entity.js';


export function createJobContainer() {
  const jobContainer = new Container();
  jobContainer.bind<JobService>(Component.JobService).to(DefaultJobService);
  jobContainer.bind<types.ModelType<JobEntity>>(Component.JobModel).toConstantValue(JobModel);
  jobContainer.bind<Controller>(Component.JobController).to(JobController).inSingletonScope();
  return jobContainer;
}
