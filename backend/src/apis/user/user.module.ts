import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { Region } from '../region/entities/region.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Region])],
  providers: [UserResolver, UserService],
})
export class UserModule {}
