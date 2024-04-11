import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from 'src/models/image.schema';
import { Token, TokenSchema } from 'src/models/token.schema';
import { AuthListener } from './auth.listener';
import { AnnotationListener } from './annotation.listener';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Token.name, schema: TokenSchema },
			{ name: Image.name, schema: ImageSchema },
		]),
	],
	providers: [AuthListener, AnnotationListener],
})
export class EventsModule {}
