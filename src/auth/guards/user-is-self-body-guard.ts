import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UserIsSelfBodyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const bodyUserId = Number(request.body.userId);
    const jwtId = Number(request.user.userId);

    if (bodyUserId !== jwtId) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }

    return true;
  }
}
