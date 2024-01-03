import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

// Este middleware serve para conseguirmos ter acesso ao current user antes de corrermos os requests handlers.
// Substituindo o interceptor ( que corre apenas antes ou depois do handler)

// Vamos dizer ao TS que o req (request) poderá ter uma "currentUser" property que vai ser uma instance do User (entity)
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    // Aqui fazemos o que fizemos dentro do interceptor
    const { userId } = req.session || {}; // Get id from the userSession

    if (userId) {
      const user = await this.usersService.findOne(userId);

      req.currentUser = user;
    }

    // Depois de termos feito todas coisas deste middleware, dizemos ao próximo middleware para correr
    next();
  }
}
