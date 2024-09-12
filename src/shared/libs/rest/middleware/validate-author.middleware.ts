import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { HttpError } from '../http.error.js';
import { Middleware } from './middleware.interface.js';

import { IsDocumentAuthor } from './validate-author.interface.js';

export class ValidateAuthorsMiddleware implements Middleware {
  constructor(
    private readonly service: IsDocumentAuthor,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute(
    { params, tokenPayload }: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const documentId = params[this.paramName];

    if (!(await this.service.isAuthor(tokenPayload.id, documentId))) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `No rights for this operation width ${this.entityName}.`,
        'ValidateAuthorMiddleware',
      );
    }

    next();
  }
}
