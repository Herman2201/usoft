import Express from 'express';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import router from './router/router.js';
import errorMiddleware from './middlewares/error-middleware.js';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

dotenv.config();
export default () => {
  const app = new Express({ logger: true });
  app.use(cors());
  app.use(morgan('dev'));
  app.use(methodOverride('_method'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/avatars', Express.static(`${path.resolve()}/avatars`));
  app.use('/picture-post', Express.static(`${path.resolve()}/picture-post`));
  app.use('/api', router);
  app.use(errorMiddleware);
  return app;
};
