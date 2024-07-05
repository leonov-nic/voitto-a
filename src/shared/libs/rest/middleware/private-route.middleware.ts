import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../index.js';

export class PrivateRouteMiddleware implements Middleware {
  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {

    if (! req.tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }
    return next();
  }
}
