import { Module } from '@nestjs/common';
import { UploadController } from './upload/upload.controller';
import { HelperService } from 'src/helper/helper.service';
import { AuthModule } from '../auth/auth.module';
import { FirebaseService } from 'src/helper/firebase.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from 'src/models/image.schema';
import { UploadService } from './upload/upload.service';
import { AdminAnnotationController } from './manage/admin.annotate.controller';
import { AdminAnnotateService } from './manage/admin.annotate.service';
import { EventsModule } from '../events/events.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
		EventsModule,
		AuthModule,
	],
	controllers: [UploadController, AdminAnnotationController],
	providers: [HelperService, FirebaseService, UploadService, AdminAnnotateService],
})
export class AnnotationModule {}
