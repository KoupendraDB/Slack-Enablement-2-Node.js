import { TaskModel, Task, mongooseDocument } from '../models/task';
import { User } from '../models/user';
import { redisClient } from '../connections/redis';
import { fetchUserByUsername } from './user';

async function fetchTaskFromCache(taskId: string): Promise<unknown> {
    const key = 'task_id:' + taskId;
    const data = await redisClient.json.get(key);
    return data;
}

async function setTaskInCache(taskId: string, task): Promise<void> {
    const key = 'task_id:' + taskId;
    await redisClient.json.set(key, '$', task);
    redisClient.expire(taskId, 30*60);
}

async function deleteTaskFromCache(taskId: string): Promise<void> {
    const key = 'task_id:' + taskId;
    redisClient.del(key);
}

async function fetchTaskById(taskId: string): Promise<mongooseDocument> {
    const cacheData: unknown = await fetchTaskFromCache(taskId);
    if (cacheData) {
        return <mongooseDocument>cacheData;
    }
    const task: mongooseDocument = await TaskModel.findById(taskId, {'_id': 0});
    if (task) {
        setTaskInCache(taskId, task);
    }
    return task;
}

async function createTask(taskRequest: Task, user: User): Promise<mongooseDocument> {
    const task: Task = {
        status: taskRequest.status || 'Ready',
        title: taskRequest.title,
        eta_done: taskRequest.eta_done ? new Date(taskRequest.eta_done) : null,
        last_modified_at: new Date(),
        last_modified_by: user.username,
        created_at: new Date(),
        created_by: user.username
    };
    if (taskRequest.assignee) {
        if (await fetchUserByUsername(taskRequest.assignee)) {
            task.assignee = taskRequest.assignee;
        } else {
            return;
        }
    }
    return new TaskModel(task);
}

async function modifyTask(taskRequest: Task, user: User): Promise<Task> {
    const task: Task = {
        last_modified_at: new Date(),
        last_modified_by: user.username,
    };
    const fields: string[] = ['status', 'title'];
    fields.forEach((key: string) => {
        if (taskRequest[key]) {
            task[key] = taskRequest[key];
        }
    })
    if (taskRequest.eta_done) {
        task.eta_done = new Date(taskRequest.eta_done);
    }
    if (taskRequest.assignee) {
        if (await fetchUserByUsername(taskRequest.assignee)) {
            task.assignee = taskRequest.assignee;
        } else {
            return;
        }
    }
    return task;
}

async function queryTasks(query): Promise<mongooseDocument[]> {
    const comparators: string[] = ['$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin']
    const fields: string[] = ['_id', 'created_by', 'assignee', 'last_modified_by', 'title', 'status', 'created_at', 'last_modified_at', 'eta_done']
    const db_query = {}
    fields.forEach((field: string) => {
        comparators.forEach((comparator: string) => {
            const param: string = field + '_' + comparator;
            let value = query[param];
            if (!value) return;
            if (comparator === '$in' || comparator === '$nin') {
                value = value.split(',');
            }
            if (field === 'created_at' || field === 'last_modified_at' || field === 'eta_done') {
                if (comparator === '$in' || comparator === '$nin') {
                    value = value.map((val: string) => new Date(val));
                } else {
                    value = new Date(value)
                }
            }
            if (!db_query[field]) {
                db_query[field] = {};
            }
            db_query[field][comparator] = value
        });
    });
    const results: mongooseDocument[] = await TaskModel.find(db_query);
    return results
}

export {
    fetchTaskById,
    createTask,
    modifyTask,
    deleteTaskFromCache,
    queryTasks
}