// tslint:disable-next-line: no-submodule-imports
import { PostgresDriver } from 'typeorm/driver/postgres/PostgresDriver';
import { createConnection } from 'typeorm';
import path from 'path';
import pg from 'pg';

export const connect = (url = process.env.DATABASE_URL) => {
  const ssl = Boolean(
    String(url).indexOf('ssl=true') >= 0 || String(url).indexOf('amazonaws.com') >= 0
  );
  pg.defaults.ssl = ssl;

  return createConnection({
    type: 'postgres',
    url,
    entities: [
      ...require('@accounts/typeorm').entities,
      path.join(__dirname, '..', 'entities', '*.ts'),
      path.join(__dirname, '..', 'entities', '*.js'),
    ],
    ssl,
    synchronize: true,
    logger: 'debug',
  }).then(connection => {
    const driver = connection.driver as PostgresDriver;

    // Fixes postgres timezone bug
    if (driver.postgres) {
      driver.postgres.defaults.parseInputDatesAsUTC = true;
      driver.postgres.types.setTypeParser(1114, (str: any) => new Date(str + 'Z'));
    }

    return connection;
  });
};
