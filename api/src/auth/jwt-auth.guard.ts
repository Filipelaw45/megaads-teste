import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';
import { Payload } from './types/payload';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Bearer token não encontrado');
    }

    const payload: Payload = this.jwtService.verify(token);

    const userRoles = payload.roles;

    const hasRole = requiredRoles.includes(userRoles);
    if (!hasRole) {
      throw new ForbiddenException('Acesso negado');
    }

    return true;
  }
}
