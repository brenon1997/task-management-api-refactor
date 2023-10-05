module.exports = app => {
  app.post('/register', app.src.app.controllers.user.register)
  app.post('/auth', app.src.app.controllers.user.auth)
  app.post('/auth/forgot_password', app.src.app.controllers.user.forgotPassword)
  app.post('/auth/reset_password', app.src.app.controllers.user.resetPassword)

  app.route('/user')
    .all(app.src.app.middlewares.authToken.authenticationJWT)
    .get(app.src.app.controllers.user.userProfile)

  app.route('/projects')
    .all(app.src.app.middlewares.authToken.authenticationJWT)
    .post(app.src.app.controllers.project.createProject)
    .get(app.src.app.controllers.project.getProject)

  app.route('/projects/:projectId')
    .all(app.src.app.middlewares.authToken.authenticationJWT)
    .get(app.src.app.controllers.project.getProjectById)
    .delete(app.src.app.controllers.project.removeProject)
    .put(app.src.app.controllers.project.updateProject)
}