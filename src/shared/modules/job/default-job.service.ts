import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { JobService } from './index.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { HttpError } from '../../libs/rest/http.error.js';
import { StatusCodes } from 'http-status-codes';
import { JobEntity, CreateJobDto, UpdateJobDto } from './index.js';
import { EmployeeEntity } from '../employee/index.js';
import { DetailEntity } from '../detail/detail.entity.js';
import { RequestQuery } from './index.js';

const DEFAULT_JOB_COUNT = 100;
const DEFAULT_JOB_OFFSET = 0;

@injectable()
export class DefaultJobService implements JobService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.JobModel) private readonly jobModel: types.ModelType<JobEntity>,
    @inject(Component.EmployeeModel) private readonly employeeModel: types.ModelType<EmployeeEntity>,
    @inject(Component.DetailModel) private readonly detailModel: types.ModelType<DetailEntity>,
  ) {}

  public async create(dto: CreateJobDto): Promise<DocumentType<JobEntity>> {
    const isExistEmployee = await this.employeeModel.findById({_id: dto.employeeId});
    const isExistDetaile = await this.detailModel.findById({_id: dto.detailId});

    if (!isExistEmployee) {
      throw new HttpError(
        StatusCodes.LOCKED,
        'Employee no exist',
        'registrationExists'
      );
    }
    if (!isExistDetaile) {
      throw new HttpError(
        StatusCodes.LOCKED,
        'Detail no exist',
        'registrationExists'
      );
    }
    const result = await this.jobModel.create(dto);
    this.logger.info(`New job created for employee: ${dto.employeeId}`);
    return result;
  }

  public async find(query: RequestQuery): Promise<DocumentType<JobEntity>[] | null> {
    const createdAt = query.createdAt ? query.createdAt : new Date().toISOString();
    const limit = query.limit && query.limit < DEFAULT_JOB_COUNT ? query.limit : DEFAULT_JOB_COUNT;
    const offset = query.offset ? query.offset : DEFAULT_JOB_OFFSET;

    let matchCondition = {};
    if (createdAt) {
        const dayStart = new Date(createdAt);
        dayStart.setHours(0, 0, 0, 0);

        if (createdAt.includes('+')) {
          const hoursToAdd = parseInt(createdAt.split('+')[1].split(':')[0]);
          dayStart.setHours(dayStart.getHours() + hoursToAdd);
        } else if (createdAt.includes('-')) {
          const hoursToMinus = parseInt(createdAt.split('-')[1].split(':')[0]);
          dayStart.setHours(dayStart.getHours() - hoursToMinus);
        };

        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        matchCondition = {
          createdAt: {
            $gte: dayStart,
            $lt: dayEnd,
          }
        };
    }

    return await this.jobModel
    .aggregate([
      {
        $lookup: {
          from: 'Users',
          localField: 'master',
          foreignField: '_id',
          as: 'masterTemp',
        },
      },
      {
        $addFields: {
          master: { $arrayElemAt: ['$masterTemp', 0] }
        }
      },
      {
        $addFields: {
          master: {
            $mergeObjects: [
              "$master",
              { _id: { $toString: "$master._id" } }
            ]
          }
        }
      },
      {
        $project: {
          masterTemp: 0
        }
      },
      {
        $lookup: {
          from: 'Employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee',
        },
      },
      {
        $unwind: '$employee'
      },
      {
        $project: {
          'employee._id': 0,
          'employee.updatedAt': 0,
          'employee.__v': 0,
          'employee.createdAt': 0,
          'employee.masterId': 0,
        }
      },
      {
        $lookup: {
          from: 'Details',
          localField: 'detailId',
          foreignField: '_id',
          as: 'detail',
        },
      },
      {
        $unwind: '$detail'
      },
      {
        $project: {
          'detail._id': 0,
          'detail.updatedAt': 0,
          'detail.__v': 0,
          'detail.createdAt': 0,
          'employee.masterId': 0,
        }
      },
      {
        $addFields: {
          convertedTimeTo: {
            $dateFromString: {
              dateString: "$timeTo"
            }
          },
          convertedTimeFrom: {
            $dateFromString: {
              dateString: "$timeFrom"
            }
          }
        }
      },
      {
        $addFields: {
          totalHours: {
            $cond: {
              if: {
                $eq: [
                  {
                    $divide: [
                      {$subtract: ["$convertedTimeTo", "$convertedTimeFrom"]},
                      3600000
                    ]
                  },
                  9
                ]
              },
              then: 8.5,
              else: {
                $divide: [
                  {$subtract: ["$convertedTimeTo", "$convertedTimeFrom"]},
                  3600000
                ]
              }
            }
          }
        }
      },
      { $addFields: { detailId: { $toString: '$detailId' } } },
      { $addFields: { employeeId: { $toString: '$employeeId' } } },
      { $addFields: { _id: { $toString: '$_id' } } },
      { $match: matchCondition },
      { $sort: { createdAt: SortType.Down } },
      { $skip: offset },
      { $limit: limit },
    ])
    .exec();
  }

  public async deleteById(jobId: string): Promise<DocumentType<JobEntity> | null> {
    const result = this.jobModel
      .findByIdAndDelete(jobId)
      .exec();
    return (await result).value as DocumentType<JobEntity>;
  }

  public async updateById(dto: UpdateJobDto, jobId: string): Promise<DocumentType<JobEntity> | null> {
    return this.jobModel
      .findOneAndUpdate({_id: jobId}, dto, {new: true})
      .exec();
  }

  public async exists(jobId: string): Promise<boolean> {
    return (await this.jobModel.exists({_id: jobId})) !== null;
  }

  public async isAuthor(userId: string, documentId: string): Promise<boolean> {
    const job = await this.jobModel.findById(documentId);
    return job?.master.toString() === userId;
  }
}
