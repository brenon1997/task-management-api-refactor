const app = require('express')();
const consign = require('consign');
const dotenv = require('dotenv');
require('./config/db');

dotenv.config();

consign()
  .include('./src/app/middlewares/authToken.js')
  .then('./src/config/middlewares.js')
  .then('./src/app/models/')
  .then('./src/app/controllers')
  .then('./src/routes/routes.js')
  .into(app);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor online na porta ${PORT}`);
});
