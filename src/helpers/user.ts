import { UserModel, User } from '../models/user';
import { redisClient } from '../connections/redis';
import { Document } from 'mongoose';

async function fetchUserFromCache(userId: string): Promise<unknown> {
    const key = 'user_id:' + userId;
    const data = await redisClient.json.get(key);
    return data;
}

async function setUserInCache(userId: string, user): Promise<void> {
    await redisClient.json.set(userId, '$', user);
    await redisClient.expire(userId, 60);
}

async function fetchUserById(userId: string): Promise<unknown> {
    const cacheData: unknown = await fetchUserFromCache(userId);
    if (cacheData) {
        return cacheData;
    }
    const user: User = await UserModel.findById(userId, {'_id': 0, 'password': 0});
    setUserInCache(userId, user);
    return user
}

async function fetchUserByUsername(username: string): Promise<Document> {
    const user: Document = await UserModel.findOne({username: username});
    if (user) {
        setUserInCache(user._id.toString(), user);
    }
    return user
}

export {
    fetchUserById,
    fetchUserByUsername
}