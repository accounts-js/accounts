import { createConnection } from 'typeorm';
import path from 'path';

export const connect = (url = process.env.DATABASE_URL) => {
    return createConnection({
        type: 'postgres',
        url,
        entities: [
            ...require('@accounts/typeorm').entities,
            path.join(__dirname, '..', 'entities', '*.ts'),
            path.join(__dirname, '..', 'entities', '*.js'),
        ],
        synchronize: true,
    }).then(connection => {
        return connection;
    });
};
