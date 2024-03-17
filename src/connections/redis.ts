import { createClient, RedisClientType } from 'redis';

import * as config from '../../config.json';

const redisClient: RedisClientType = createClient({
    password: process.env[config.redis.password_variable],
    socket: {
        host: config.redis.server,
        port: config.redis.port
    }
});
redisClient.on('connect', function() {
    console.log('[+] Connected to Redis!')
    
});

export {redisClient}
