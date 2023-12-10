import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as compression from 'compression';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import * as morgan from 'morgan';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { HttpExceptionFilter } from './filters/bad-request.filter';
import { QueryFailedFilter } from './filters/query-failed.filter';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { setupSwagger } from './setup-swagger';
import { middleware as expressCtx } from 'express-ctx';
import { join } from 'path';
import * as express from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const xmlparser = require('express-xml-bodyparser');

export async function bootstrap(): Promise<NestExpressApplication> {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  app.enable('trust proxy'); // sử dụng khi đi qua reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

  app.use(helmet());

  app.use((req, res, next) => {
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });

  app.enableCors({
    allowedHeaders: [
      'Accept',
      'Accept-Version',
      'Content-Type',
      'Api-Version',
      'Origin',
      'X-Requested-With',
      'Authorization',
    ],
    origin: ['http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
    exposedHeaders: ['API-Token-Expiry'],
  });
  // app.setGlobalPrefix('/api'); use api as global prefix if you don't have subdomain
  app.use(
    RateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.use(compression());
  app.use(morgan('combined'));
  app.enableVersioning();
  app.use(xmlparser());

  const reflector = app.get(Reflector);

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.useGlobalFilters(
    new HttpExceptionFilter(reflector),
    new QueryFailedFilter(reflector),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  // only enable swagger in development
  if (process.env.NODE_ENV === 'development') {
    setupSwagger(app);
  } else {
    app.enableShutdownHooks();
  }

  app.use(expressCtx);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.info(`Server running on port ${port}`);

  return app;
}

void bootstrap();
