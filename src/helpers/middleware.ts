import { decodeAccessToken } from './token';
import { User } from '../models/user';
import { StatusCodes } from '../constants';


async function tokenRequired(req, res, next) {
    const bearerToken: string = req.header('bearer-token');
    if (bearerToken) {
        const user: User = await decodeAccessToken(bearerToken);
        if (user) {
            req.user = user;
            next();
        } else {
            res.status(StatusCodes.Unauthorized).send({
                message: 'Invalid bearer token!'
            });
        }
    } else {
        res.status(StatusCodes.Unauthorized).send({
            message: 'Bearer token missing!'
        });
    }
}

export {tokenRequired}
