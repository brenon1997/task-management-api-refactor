import { RequestHandler, Router } from 'express';
import { Request, Response } from 'express';
import { createProject, getProject, getProjectById, updateProject, removeProject } from '../app/controllers/project';
import { register, auth, userProfile, forgotPassword, resetPassword } from '../app/controllers/user';
import authenticationJWT, { RequestWithUserId } from '../app/middlewares/authToken';

const router = Router();

router.post('/register', register);
router.post('/auth', auth);
router.post('/auth/forgot_password', forgotPassword);
router.post('/auth/reset_password', resetPassword);

router.route('/user')
  .all(authenticationJWT as RequestHandler)
  .get((req: Request, res: Response) => {
    userProfile((req as RequestWithUserId), res);
  });

router.route('/projects')
  .all(authenticationJWT as RequestHandler)
  .post((req: Request, res: Response) => {
    createProject((req as RequestWithUserId), res)
  })
  .get(getProject);

router.route('/projects/:projectId')
  .all(authenticationJWT as RequestHandler)
  .get(getProjectById)
  .delete(removeProject)
  .put((req: Request, res: Response) => {
    updateProject((req as RequestWithUserId), res)
  });

export default router;
