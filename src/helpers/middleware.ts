import { decodeAccessToken } from './token';

async function tokenRequired(req, res, next) {
    const bearerToken: string = req.header('bearer-token');
    if (bearerToken) {
        const user = await decodeAccessToken(bearerToken);
        if (user) {
            req.user = user;
            next();
        } else {
            res.status(401).send({
                message: 'Invalid bearer token!'
            });
        }
    } else {
        res.status(404).send({
            message: 'Bearer token missing!'
        });
    }
}

export {tokenRequired}
