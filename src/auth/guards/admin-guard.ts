import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.user.isAdmin) {
      throw new ForbiddenException('You are not authorized to perform this action');
    }
    
    return true;
  }
}
