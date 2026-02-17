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
import { UserEntity } from '../user/user.entity.js';
import { RequestQuery, CreateRequestQuery} from './index.js';

const DEFAULT_JOB_COUNT = 250;
const DEFAULT_JOB_OFFSET = 0;

@injectable()
export class DefaultJobService implements JobService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.JobModel) private readonly jobModel: types.ModelType<JobEntity>,
    @inject(Component.EmployeeModel) private readonly employeeModel: types.ModelType<EmployeeEntity>,
    @inject(Component.DetailModel) private readonly detailModel: types.ModelType<DetailEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async create(dto: CreateJobDto, query: CreateRequestQuery): Promise<DocumentType<JobEntity>> {
    const isTimeNow = String(query.isTimeNow) !== 'false';

    const isExistEmployee = await this.employeeModel.findById({_id: dto.employeeId});
    const isExistDetaile = await this.detailModel.findById({_id: dto.detailId});

    if (!isExistEmployee) {throw new HttpError(StatusCodes.NOT_FOUND, 'Employee no exist', 'registrationExists');}
    if (!isExistDetaile) {throw new HttpError(StatusCodes.NOT_FOUND, 'Detail no exist', 'registrationExists');}
    // const result = await this.jobModel.create(dto);
    const newDate = new Date();

    if (!isTimeNow) {
      // Если НЕ текущее время (false), вычитаем ровно 24 часа
      newDate.setDate(newDate.getDate() - 1);
    }

    const result = await this.jobModel.create({
        ...dto,
        createdAt: newDate,
        updatedAt: newDate,
    });

    this.logger.info(`New job created for employee: ${dto.employeeId}`);
    return result;
  }

  public async find(query: RequestQuery, userId: string): Promise<DocumentType<JobEntity>[] | null> {

    const createdAt = query.createdAt ? query.createdAt : new Date().toISOString();
    const limit = query.limit ? query.limit : DEFAULT_JOB_COUNT;
    const offset = query.offset ? query.offset : DEFAULT_JOB_OFFSET;
    let matchCondition = {};
    let dayStart;
    let dayEnd;

    if (query.filterByMonth) {
      const monthYear = new Date(createdAt);
      const month = monthYear.getMonth();
      const year = monthYear.getFullYear();
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 1);


      matchCondition = {
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth
        }
      };
    } else if (createdAt) {
        dayStart = new Date(createdAt); // JS сам поймет смещение (+03:00)
        dayStart.setHours(0, 0, 0, 0);
        dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);


        // dayStart = new Date(createdAt);
        // dayStart.setHours(0, 0, 0, 0);

        // if (createdAt.includes('+')) {
        //   const hoursToAdd = parseInt(createdAt.split('+')[1].split(':')[0]);
        //   dayStart.setHours(dayStart.getHours() + hoursToAdd);
        // } else if (createdAt.includes('-')) {
        //   const hoursToMinus = parseInt(createdAt.split('-')[1].split(':')[0]);
        //   dayStart.setHours(dayStart.getHours() - hoursToMinus);
        // };

        // dayEnd = new Date(dayStart);
        // dayEnd.setDate(dayEnd.getDate() + 1);

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
            $cond: {
              if: { $or: [
                { $eq: ["$timeTo", "-"] },
                { $not: ["$timeTo"] } // проверка на null/undefined
              ]},
              // if: { $eq: ["$timeTo", "-"] },
              then: "-",
              // else: {
              //   $dateFromString: {
              //     dateString: "$timeTo"
              //   }
              // }
              else: {
                $dateFromString: {
                  dateString: "$timeTo",
                  onError: null, // Важно! Чтобы агрегация не падала
                  onNull: null
                }
              }
            }
          },
          convertedTimeFrom: {
            $cond: {
              if: { $eq: ["$timeFrom", "-"] },
              then: "-",
              else: {
                $dateFromString: {
                  dateString: "$timeFrom"
                }
              }
            }
          }
        }
      },
      {
        $addFields: {
          totalHours: {
            $cond: {
              if: { $and: [{ $eq: ["$timeTo", "-"] }, { $eq: ["$timeFrom", "-"] }] },
              then: "-",
              else: {
                $let: {
                  vars: {
                    hoursDifference: {
                      $divide: [
                        { $subtract: ["$convertedTimeTo", "$convertedTimeFrom"] },
                        3600000
                      ]
                    },
                    // Вычисляем время старта в числовом формате (часы + минуты/60)
                    startVal: {
                      $let: {
                        vars: { d: { $dateFromString: { dateString: { $substr: ["$timeFrom", 0, 19] } } } },
                        in: { $add: [{ $hour: "$$d" }, { $divide: [{ $minute: "$$d" }, 60] }] }
                      }
                    },
                    // Вычисляем время конца в числовом формате (часы + минуты/60)
                    endVal: {
                      $let: {
                        vars: { d: { $dateFromString: { dateString: { $substr: ["$timeTo", 0, 19] } } } },
                        in: { $add: [{ $hour: "$$d" }, { $divide: [{ $minute: "$$d" }, 60] }] }
                      }
                    }
                  },
                  in: {
                    $cond: {
                      if: {
                        $or: [
                          // Условие 1: старт < 10:00 и конец > 10:30 и обед разрешен
                          {
                            $and: [
                              { $lte: ["$$startVal", 10] },
                              { $gte: ["$$endVal", 10.5] },
                              { $eq: ["$isLunch", true] }
                            ]
                          },
                          // Условие 2: старт < 19:00 и конец > 19:30 и обед разрешен
                          {
                            $and: [
                              { $lte: ["$$startVal", 19] },
                              { $gte: ["$$endVal", 19.5] },
                              { $eq: ["$isLunch", true] }
                            ]
                          }
                        ]
                      },
                      then: { $subtract: ["$$hoursDifference", 0.5] },
                      else: "$$hoursDifference"
                    }
                  }
                }
              }
            }
          }
        }
      },

      // {
      //   $addFields: {
      //     totalHours: {
      //       $cond: {
      //         if: { $and: [{ $eq: ["$timeTo", "-"] }, { $eq: ["$timeFrom", "-"] }] },
      //         then: "-",
      //         else: {
      //           $let: {
      //             vars: {
      //               hoursDifference: {
      //                 $divide: [
      //                   { $subtract: ["$convertedTimeTo", "$convertedTimeFrom"] },
      //                   3600000
      //                 ]
      //               }
      //             },
      //             in: {
      //               $cond: {
      //                 if: {
      //                   $or: [
      //                     {
      //                       $and: [
      //                         {$lt: [{$hour: { $dateFromString: { dateString:  {$substr: ["$timeFrom", 0, 19]}} }}, 12]},
      //                         {$gte: [{$hour: { $dateFromString: { dateString:  {$substr: ["$timeTo", 0, 19]}} }}, 12]},
      //                         {$eq: ["$isLunch", true]}
      //                       ]
      //                     },
      //                     {
      //                       $and: [
      //                         { $gte: ["$$hoursDifference", 9] },
      //                         { $eq: ["$isLunch", true] }
      //                       ]
      //                     }
      //                   ]
      //                 },
      //                 then: { $subtract: ["$$hoursDifference", 0.5] }, // Вычитаем 0.5 часа (30 минут)
      //                 else: "$$hoursDifference"
      //               }
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }
      // },

      { $addFields: { detailId: { $toString: '$detailId' } } },
      { $addFields: { employeeId: { $toString: '$employeeId' } } },
      { $addFields: { _id: { $toString: '$_id' } } },

      {
        $lookup: {
          from: 'Jobs',
          let: {
              userId: { $toObjectId: userId },
              dayStart,
              dayEnd,
            },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$master", "$$userId"] },
                    { $gte: ["$createdAt", "$$dayStart"] },
                    { $lt: ["$createdAt", "$$dayEnd"] }
                  ]
                }
              },
            },

            { $count: 'count' },
          ], as: "countData"
        }
      },
      {
        $unwind: {
          path: "$countData",
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $addFields: {
          count: { $ifNull: ["$countData.count", 0] }
        }
      },
      { $match: matchCondition },
      { $sort: { createdAt: query.filterByMonth ? SortType.Up : SortType.Down } },
      { $skip: offset },
      { $limit: limit },
    ])
    .exec();
  }

  public async deleteById(jobId: string): Promise<DocumentType<JobEntity> | null> {
    const result = this.jobModel
      // .findByIdAndDelete(jobId)
      // сделал это изиенение из за ошибки на продакшн сервере
      .findOneAndDelete({_id: jobId})
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
    const user = await this.userModel.findById(userId);
    return job?.master.toString() === userId || user?.type === 'admin';
  }
}
