import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class isSelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const paramId = Number(request.params.id);
    const jwtId = Number(request.user.userId);
    console.log(request.user.isAdmin);

    if (request.user.isAdmin || paramId === jwtId) {
      return true;
    }

    throw new ForbiddenException('You are not authorized to perform this action');
  }
}
