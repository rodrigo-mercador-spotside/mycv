import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const dbConfig = require('../ormconfig.js');

import { dataSourceOptions } from '../ormconfig';

// console.log(process.env.NODE_ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Este config module vai ser definido para toda a nossa APP
      envFilePath: `.env.${process.env.NODE_ENV}`, // o NODE_ENV vai colocar o tipo de ambiente (dev,test,prod...)
    }),

    // Simple
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),

    // More Complex
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService], // Tells the DI to find configservice que deve ter todas as configs do ficheiro.env
    //   useFactory: (config: ConfigService) => {
    //     // DI -> instance of the configservice
    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'),
    //       entities: [User, Report],
    //       synchronize: true,
    //     };
    //   },
    // }),

    // All environments (external config)
    TypeOrmModule.forRoot(dataSourceOptions),

    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    //cada vez que criamos uma instance do module, utiliza este pipe para cada request á APP
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // Segurança adicional para nao se adicionar campos que não são permitidos pelas entities
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    // Setup middleware that will run on every incoming request
    consumer
      .apply(
        cookieSession({
          //keys: ['asdfasdf'], // Used to encrypt the info inside the cookie
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*'); // every single incoming request
  }
}
