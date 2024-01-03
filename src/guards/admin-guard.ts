import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // Verifica se o user existe
    if (!request.currentUser) {
      return false;
    }

    return request.currentUser.admin; // Deixa passar se o currentUser.admin for true
  }
}
