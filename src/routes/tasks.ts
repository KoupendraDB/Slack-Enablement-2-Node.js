import { Router, Request, Response, NextFunction } from 'express';
import { tokenRequired } from '../helpers/middleware';
import { mongooseDocument } from '../models/task';
import { queryTasks } from '../helpers/task';

const tasksRouter: Router = Router();

tasksRouter.get('/', tokenRequired, async function(req: Request, res: Response, next: NextFunction) {
    const tasks: mongooseDocument[] = await queryTasks(req.query);
    res.send({
        sucess: true,
        tasks: tasks
    })
    next()
});

export { tasksRouter };
