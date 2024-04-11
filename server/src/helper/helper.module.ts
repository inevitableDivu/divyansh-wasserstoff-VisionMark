import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { FirebaseService } from './firebase.service';

@Module({
	providers: [HelperService, FirebaseService],
	exports: [HelperService, FirebaseService],
})
export class HelperModule {}
