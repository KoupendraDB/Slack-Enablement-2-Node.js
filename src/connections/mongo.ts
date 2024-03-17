import mongoose from "mongoose";

import * as config from '../../config.json';

async function connectMongo () {
    const mongoUri: string = config.mongo.server.
                            replace('{username}', process.env[config.mongo.username_variable]).
                            replace('{password}', process.env[config.mongo.password_variable]).
                            replace('{database}', config.mongo.database_name);
    await mongoose.connect(mongoUri);
    console.log('[+] Connected to Mongo!')
}

export {connectMongo};
