import express from 'express';

import * as config from '../config.json';
import {connectMongo} from './connections/mongo';
import {redisClient} from './connections/redis';
import {userRouter} from './routes/user';

const app: express.Express = express();
const port: number = config.server_port;

app.use(express.json());

app.use('/user', userRouter);

(async () => {
    try {
        console.log('[*] Connecting to Mongo...')
        await connectMongo();
        console.log('[*] Connecting to Redis...')
        await redisClient.connect();
        app.listen(port, () => {
            return console.log(`Express is listening at http://localhost:${port}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
