import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Controllers
import { UsersController } from './users.controller';
// Providers/Services
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
// Entities
import { User } from './user.entity';
// Interceptors
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
// Middlewares
import { CurrentUserMiddleware } from './middlewares/current-user-middleware';

@Module({
  imports: [
    // This creates the repository
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    // { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor }, // substituido pelo middleware abaixo
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
