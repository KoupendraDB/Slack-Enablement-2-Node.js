import express from 'express';

import * as config from '../config.json';
import { connectMongo } from './connections/mongo';
import { redisClient } from './connections/redis';
import { userRouter } from './routes/user';
import { taskRouter } from './routes/task';
import { getAccessToken } from './helpers/token';

const app: express.Express = express();
const port: number = config.server_port;

app.use(express.json());

app.use('/user', userRouter);
app.use('/task', taskRouter);

app.post('/login', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const accessToken: string = await getAccessToken(username, password);
    if (accessToken) {
        res.send({
            success: true,
            access_token: accessToken
        })
    } else {
        res.status(404).send({
            success: false
        })
    }
    next();
});

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
