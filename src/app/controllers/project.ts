import { Request, Response } from 'express';
import { ProjectModel } from '../models/Project';
import { TaskModel, ITask } from '../models/Task';

interface RequestWithUserId extends Request {
  userId: string;
}

interface RequestWithParams extends Request {
  params: {
    projectId: string;
  };
}

const createProject = async (req: RequestWithUserId, res: Response): Promise<void> => {
  try {
    const { title, description, tasks } = req.body;

    const project = new ProjectModel({ title, description, user: req.userId });

    await Promise.all(tasks.map(async (task: ITask) => {
      const projectTask = new TaskModel({
        ...task,
        project: project._id,
        assignedTo: req.userId,
      });

      await projectTask.save();

      project.tasks.push(projectTask);
    }));

    await project.save();

    res.send({ project });
  } catch (err) {
    res.status(400).send({ error: 'Error creating new project.' });
  }
};

const getProject = async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await ProjectModel.find().populate(['user', 'tasks']);
    res.send({ projects });
  } catch (err) {
    res.status(400).send({ error: 'Error loading projects.' });
  }
};

const getProjectById = async (req: RequestWithParams, res: Response): Promise<void> => {
  try {
    const project = await ProjectModel.findById(req.params.projectId).populate(['user', 'tasks']);
    res.send({ project });
  } catch (err) {
    res.status(400).send({ error: 'Error loading project.' });
  }
};

const updateProject = async (req: RequestWithUserId, res: Response): Promise<void> => {
  try {
    const { title, description, tasks } = req.body;

    const project = await ProjectModel.findByIdAndUpdate(req.params.projectId, { title, description }, { new: true });

    if (project) {
      const projectTasks: ITask[] = [];

      for (const taskData of tasks) {
        const task = new TaskModel({
          ...taskData,
          project: project._id,
          assignedTo: req.userId,
        });

        await task.save();

        projectTasks.push(task);
      }

      project.set('tasks', projectTasks);

      await project.save();

      res.send({ project });
    } else {
      res.status(404).send({ error: 'Project not found.' });
    }
  } catch (err) {
    console.error(err);
    res.status(400).send({ error: 'Error updating project.' });
  }
};

const removeProject = async (req: RequestWithParams, res: Response): Promise<void> => {
  try {
    await ProjectModel.findByIdAndRemove(req.params.projectId);
    res.status(200).send({ message: 'Project successfully removed!' });
  } catch (err) {
    res.status(400).send({ error: 'Error removing project.' });
  }
};

export {
  createProject,
  getProject,
  getProjectById,
  updateProject,
  removeProject,
};
