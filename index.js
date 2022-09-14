import Express from 'express';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import router from './router/router.js';
import errorMiddleware from './middlewares/error-middleware.js';
import * as dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();
export default () => {
  const app = new Express({ logger: true });
  app.use(morgan('dev'));
  app.use(methodOverride('_method'));
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use('/api', router);
  app.use(errorMiddleware);
  return app;
};
