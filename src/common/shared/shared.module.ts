import { UserDataService } from '@/common/shared/services/user.service';
import { Global, Module } from '@nestjs/common';
import { AppConfigService } from '@/common/shared/services/app-config.service';

@Global()
@Module({
	providers: [UserDataService, AppConfigService],
	exports: [UserDataService, AppConfigService],
})
export class SharedModule {}
