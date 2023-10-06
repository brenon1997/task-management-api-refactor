import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITask extends Document {
  title: string;
  project: Types.ObjectId;
  assignedTo: Types.ObjectId;
  completed: boolean;
  createdAt: Date;
}

const TaskSchema: Schema<ITask> = new Schema<ITask>({
  title: {
    type: String,
    required: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TaskModel: Model<ITask> = mongoose.model<ITask>('Task', TaskSchema);

export { TaskModel };
