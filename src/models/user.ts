import mongoose from 'mongoose';

const UserSchema: mongoose.Schema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
  }, {
    collection: 'user'  
});

interface User {
  username: string;
  password: string;
}

const UserModel = mongoose.model('User', UserSchema)

type mongooseDocument = mongoose.Document

export { User, UserModel, mongooseDocument }
