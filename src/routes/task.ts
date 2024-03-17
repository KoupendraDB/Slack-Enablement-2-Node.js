import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { Task, TaskModel, mongooseDocument } from '../models/task';
import { tokenRequired } from '../helpers/middleware';
import { fetchTaskById, createTask, modifyTask, deleteTaskFromCache } from '../helpers/task';

const taskRouter: Router = Router();

interface UserRequest extends Request {
    user?: User;
}

taskRouter.get('/:taskId', tokenRequired, async function(req: Request, res: Response, next: NextFunction) {
    const taskId: string = req.params.taskId;
    const task: unknown = await fetchTaskById(taskId);
    if (task) {
        res.send({
            success: true,
            task: task
        })
    } else {
        res.status(404);
        res.send({
            success: false,
        });
    }
    next();
});

taskRouter.post('/', tokenRequired, async function(req: UserRequest, res: Response, next: NextFunction) {
    const taskRequest: Task = req.body;
    const task: mongooseDocument = await createTask(taskRequest, req.user);
    if (!task) {
        res.status(400).send({
            success: false,
            message: 'Invalid assignee!'
        });
        return next();
    }
    try {
        const newTask = await task.save();
        res.send({
            success: true,
            task_id: newTask._id.toString()
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'Invalid data!'
        });
    }
    next();
});

taskRouter.patch('/:taskId', tokenRequired, async function(req: UserRequest, res: Response, next: NextFunction) {
    const taskId: string = req.params.taskId;
    const taskRequest: Task = req.body;
    const task: Task = await modifyTask(taskRequest, req.user);
    if (!task) {
        res.status(400).send({
            success: false,
            message: 'Invalid assignee!'
        });
        return next();
    }
    try {
        const updateResult = await TaskModel.updateOne({ _id: taskId }, task);
        if (updateResult.modifiedCount) {
            res.send({
                success: true,
            });
            deleteTaskFromCache(taskId);
        } else {
            throw new Error('Invalid task')
        }
    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'Invalid data!'
        });
    }
    next();
});

export { taskRouter };
