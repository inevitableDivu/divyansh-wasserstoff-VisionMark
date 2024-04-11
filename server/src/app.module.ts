import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './services/auth/auth.module';
import { AnnotationModule } from './services/annotation/annotation.module';
import { HelperModule } from './helper/helper.module';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            expandVariables: true,
        }),
        ThrottlerModule.forRoot(),
        MongooseModule.forRoot(configuration().database.url, {
            dbName: configuration().database.name,
        }),
        EventEmitterModule.forRoot(),
        HelperModule,
        AuthModule,
        AnnotationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
