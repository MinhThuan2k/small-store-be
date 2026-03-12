import { UserDataService } from '@/common/shared/services/user.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
	providers: [UserDataService],
	exports: [UserDataService],
})
export class SharedModule {}
