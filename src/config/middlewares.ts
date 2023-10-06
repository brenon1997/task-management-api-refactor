import { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

export default (app: Application): void => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());
};
