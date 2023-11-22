import { createConnection } from 'typeorm';
import { entities } from '@accounts/typeorm';

export const connect = (url = process.env.DATABASE_URL) => {
  return createConnection({
    type: 'postgres',
    url,
    entities,
    synchronize: true,
  }).then((connection) => {
    return connection;
  });
};
