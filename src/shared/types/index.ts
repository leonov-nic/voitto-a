import { TYPES, NAMESOFJOB } from './const.js';

export * from './component.enum.js';
export type RequestParams = Record<string, unknown>;
export type RequestBody = Record<string, unknown>;

export enum UserType {
  Admin = 'admin',
  Regular = 'regular',
  Storage = 'storage',
}

export enum SortType {
  Down = -1,
  Up = 1,
}

export enum TypeOperation {
  Shipment = 'shipment',
  Arrival = 'arrival',
}

export enum Frequency {
  often = '1',
  middle = '2',
  rarely = '3',
  veryRarely = '4',
}

export type TUserType  = typeof TYPES[number];

export type TFrequency = keyof typeof Frequency;

export type TDetail = {
  shortName: string;
  longName: string;
  normOfMinute?: string;
  customer: string;
}

export type TTypeOfJob = {
  name: string;
  longName: string;
}

export type TNameOfJob = typeof NAMESOFJOB[number];

export type TEmployee = {
  familyName: string;
  registrationNumber: number;
  mainJob: string;
  masterId: string;
}

export type TJob = {
  employeeId: string;
  timeFrom: string;
  timeTo: string;
  detailId: string;
  typeOfJob: TNameOfJob;
  extra: number;
  quantity: number;
  comment?: string;
  master: string;
}

export type User = {
  name: string;
  email: string;
  password: string;
  type: TUserType;
  avatar?: string;
}

export type ValidationErrorField = {
  property: string;
  value: string;
  messages: string[];
};
