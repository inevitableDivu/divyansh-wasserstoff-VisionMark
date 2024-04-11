import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HelperService } from 'src/helper/helper.service';
import { HelperModule } from 'src/helper/helper.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
	controllers: [AuthController],
	providers: [AuthService, HelperService],
	exports: [AuthService],
})
export class AuthModule {}
