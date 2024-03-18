import { UserModel, UserDocument } from '../models/user';
import { redisClient } from '../connections/redis';

async function fetchUserFromCache(userId: string): Promise<UserDocument> {
    const key = 'user_id:' + userId;
    const data = <UserDocument><unknown> await redisClient.json.get(key);
    return data;
}

async function setUserInCache(userId: string, user): Promise<void> {
    const key = 'user_id:' + userId;
    await redisClient.json.set(key, '$', user);
    await redisClient.expire(userId, 60);
}

async function fetchUserById(userId: string): Promise<UserDocument> {
    const cacheData: UserDocument = await fetchUserFromCache(userId);
    if (cacheData) {
        return cacheData;
    }
    const user: UserDocument = <UserDocument> await UserModel.findById(userId, {'_id': 0, 'password': 0});
    if (user) {
        setUserInCache(userId, user);
    }
    return user
}

async function fetchUserByUsername(username: string): Promise<UserDocument> {
    const user: UserDocument = await UserModel.findOne({username: username});
    if (user) {
        setUserInCache(user._id.toString(), user);
    }
    return user
}

export {
    fetchUserById,
    fetchUserByUsername
}