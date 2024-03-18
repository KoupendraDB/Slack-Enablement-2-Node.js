import mongoose from 'mongoose';

const TaskSchema: mongoose.Schema = new mongoose.Schema({
    last_modified_by: {type: String, required: true},
    last_modified_at: {type: Date, required: true},
    created_by: {type: String, required: true},
    created_at: {type: Date, requied: true},
    assignee: {type: String, required: true},
    title: {type: String},
    status: {type: String, required: true},
    eta_done: {type: Date}
  }, {
    collection: 'task'  
});

const TaskModel = mongoose.model('TaskModel', TaskSchema);
interface Task {
  last_modified_by?: string,
  last_modified_at?: Date,
  created_by?: string,
  created_at?: Date,
  assignee?: string,
  title?: string,
  status?: string,
  eta_done?: Date
}

type TaskDocument = mongoose.Document<Task>

export { Task, TaskModel, TaskDocument}
