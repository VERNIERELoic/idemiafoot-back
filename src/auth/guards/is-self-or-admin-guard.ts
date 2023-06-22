import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class isSelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const paramId = Number(request.params.id);
    const jwtId = Number(request.user.userId);

    if (paramId !== jwtId) {
      throw new ForbiddenException('You are not authorized to perform this action');
    }

    if (!request.user.isAdmin) {
      throw new ForbiddenException('You are not authorized to perform this action');
    }

    return true;
  }
}
