import { Router, Request, Response, NextFunction } from 'express';
import { User, UserModel, mongooseDocument } from '../models/user';
import { fetchUserById } from '../helpers/user';

const userRouter: Router = Router();

userRouter.get('/:userId', async function(req: Request, res: Response, next: NextFunction) {
    const userId: string = req.params.userId;
    const user: unknown = await fetchUserById(userId);
    if (user) {
        res.send({
            success: true,
            user: user
        })
    } else {
        res.status(404);
        res.send({
            success: false,
        });
    }
    next();
});

userRouter.post('/', async function(req: Request, res: Response, next: NextFunction) {
    const userRequest: User = req.body;
    const user: mongooseDocument = new UserModel(userRequest);
    try {
        const newUser = await user.save();
        if (newUser !== user) {
            res.status(409).send({
                success: false,
                message: 'Username already exists!'
            });
        } else {
            res.send({
                success: true,
                user_id: user._id.toString()
            });
        }
    } catch {
        res.status(404).send({
            success: false,
            message: 'Username already exists!'
        });
    }
    next();
});

export { userRouter };
