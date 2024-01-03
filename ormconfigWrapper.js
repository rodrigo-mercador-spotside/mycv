// Para podermos utilizar este ficheiro temos que utilizar o ficheiro de configuração original do tutorial ( lectures 161 - 164 ).
// Para isso no package.json também temos de utilizar apenas:

// Colocar isto e apenas isto a baixo no package.json ----->
// "typeorm": "cross-env NODE_ENV=development node --require ts-node/register ./node_modules/typeorm/cli.js"

// bem como os comandos:
// 4. Run command to generate migration file

// ------------------ npm run typeorm migration:generate -- -o migrations/schema-init -d ./ormconfigWrapper.js

// 5. Execute migration script:

// ------------------ npm run typeorm migration:run -- -d ./ormconfigWrapper.js

const { DataSource } = require('typeorm');
const ds = new DataSource(require('./ormconfig'));
module.exports = { ds };
