import { UsersController } from '@/modules/users/controllers/users.controller';
import { UsersService } from '@/modules/users/service/users.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
