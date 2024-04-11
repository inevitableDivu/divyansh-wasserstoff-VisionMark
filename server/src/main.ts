/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { express } from 'express-useragent';
import helmet from 'helmet';

/* -------------------------- Internal Dependencies -------------------------- */
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/error.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';

// initialize dotenv to load environment variables to be used in application outside modules
import { config } from 'dotenv';
config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new HttpExceptionFilter());

    app.useGlobalInterceptors(new ResponseInterceptor());

    app.enableCors({ origin: ['*'], credentials: true });

    // initialize helmet to protect from well-known web vulnerabilities
    app.use(helmet());

    // initialize cookie parser to parse cookies
    app.use(cookieParser());

    app.use(express());

    // validating incoming request payloads and alter if necessary
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    app.setGlobalPrefix('api');

    app.enableVersioning({
        defaultVersion: '1',
        type: VersioningType.URI,
    });

    const config = new DocumentBuilder()
        .setTitle('Image Annotation API')
        .setDescription(
            'The Image Annotation API where you can annotate images with bounding boxes. This documentation contains all the endpoints and their descriptions along with the different roles.',
        )
        .setVersion('1.0')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        })
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, document);

    await app.listen(process.env.PORT || 3000);

    return Promise.resolve(app);
}

let app: INestApplication;
bootstrap().then((appInstance) => {
    app = appInstance;
});

export { app };
