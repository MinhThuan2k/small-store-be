import { UserDataService } from '@/common/data/user.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [UserDataService],
  exports: [UserDataService],
})
export class DataModule {}
