import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UserIsSelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const paramId = Number(request.params.id);
    const jwtId = Number(request.user.userId);

    if (paramId !== jwtId) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }

    return true;
  }
}
