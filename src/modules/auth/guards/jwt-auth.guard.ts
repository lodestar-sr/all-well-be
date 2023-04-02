import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IPayload } from '../auth.types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super(reflector);
  }

  handleRequest(
    err: Error,
    payload: IPayload,
  ): any {
    if (err || !payload) {
      throw err || new ForbiddenException();
    }

    return payload;
  }
}
