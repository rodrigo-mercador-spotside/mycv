import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// 1º solution
// import { setupApp } from './setup-app';

// Base Solution
// import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const cookieSession = require('cookie-session'); //TS connflits that don't let use of import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 1ª solution (More simple)
  // setupApp(app);

  // Base Solution
  // app.use(
  //   cookieSession({
  //     keys: ['asdfasdf'], // Used to encrypt the info inside the cookie
  //   }),
  // );
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // Segurança adicional para nao se adicionar campos que não são permitidos pelas entities
  //   }),
  // );
  await app.listen(process.env.PORT || 3000); // Heroku specific
}
bootstrap();
