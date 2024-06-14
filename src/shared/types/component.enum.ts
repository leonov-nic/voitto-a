export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  Io: Symbol.for('Io'),
  DatabaseClient: Symbol.for('DatabaseClient'),

  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),
  UserController: Symbol.for('UserController'),
  AuthService: Symbol.for('AuthService'),
  AuthExceptionFilter: Symbol.for('AuthExceptionFilter'),

  ExceptionFilter: Symbol.for('ExceptionFilter'),
  HttpExceptionFilter: Symbol.for('HttpExceptionFilter'),
  ValidationExceptionFilter: Symbol.for('ValidationExceptionFilter'),
  PathTransformer: Symbol.for('PathTransformer'),

  JobService: Symbol.for('JobService'),
  JobModel: Symbol.for('JobModel'),
  JobController: Symbol.for('JobController'),

  EmployeeService: Symbol.for('EmployeeService'),
  EmployeeModel: Symbol.for('EmployeeModel'),
  EmployeeController: Symbol.for('EmployeeController'),

  DetailService: Symbol.for('DetailService'),
  DetailModel: Symbol.for('DetailModel'),
  DetailController: Symbol.for('DetailController'),
} as const;
