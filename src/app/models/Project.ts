import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { ITask } from './Task';

interface IProject extends Document {
  title: string;
  description: string;
  user: Types.ObjectId;
  tasks: Types.Array<ITask>;
  createdAt: Date;
}

const ProjectSchema: Schema<IProject> = new Schema<IProject>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProjectModel: Model<IProject> = mongoose.model<IProject>('Project', ProjectSchema);

export { ProjectModel };
