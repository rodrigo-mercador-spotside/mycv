// Este ficheiro está em JS por causa dos erros que causa nos vários ambientes quando utilizamos o TS
// Isto por causa da integração do TypeORM com o NestJS

//--------------------- ESTE FICHEIRO DEPENDE DO FICHEIRO ormconfigWrapper.js PARA FUNCIONAR -------------------//
//----------------------------- (Passou-se a utilizar o ficheiro "ormconfig.ts") ------------------------------//

let dbConfig = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

// a flag "o" -> --outputjs, permite criar uma migration num ficheiro em js, não tendo de transpilar o ts em js com comandos adicionais

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'], // Por causa do ambiente de testes. Dizemos no tsconfig, para aceitar ficheiros JS
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'], // Por causa do ambiente de testes que aqui, só podem ser corridos com ts
      migrationsRun: true, // migrations run before every single test
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('unknown environment');
}

module.exports = dbConfig;
