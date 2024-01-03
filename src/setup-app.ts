// 1º Solution to App middlewares setup

import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session'); //TS connflits that don't let use of import

export const setupApp = (app: any) => {
  app.use(
    cookieSession({
      keys: ['asdfasdf'], // Used to encrypt the info inside the cookie
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Segurança adicional para nao se adicionar campos que não são permitidos pelas entities
    }),
  );
};
