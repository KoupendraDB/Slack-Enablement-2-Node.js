import jwt from 'jsonwebtoken';
import { UserModel, User, mongooseDocument } from '../models/user';
import { fetchUserById } from './user';
import * as config from '../../config.json';

async function getAccessToken(username: string, password: string): Promise<string> {
    const user: mongooseDocument = await UserModel.findOne({username: username, password: password})
    if (user) {
        return jwt.sign(
            { userId: user._id.toString() },
            process.env[config.app_secret_key_variable],
            { expiresIn: "1h", algorithm: 'HS256' }
        );
    }
    return;
}

async function decodeAccessToken(token: string): Promise<User> {
    try {
        const decodedToken = jwt.verify(token, process.env[config.app_secret_key_variable]);
        if (decodedToken.userId) {
            const user: unknown = await fetchUserById(decodedToken.userId);
            return user;
        }
    } catch (error) {
        return;
    }
    return;
}

export {decodeAccessToken, getAccessToken}