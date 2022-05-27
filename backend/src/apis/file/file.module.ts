import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { FileResolver } from './file.resolver';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [FileResolver, FileService],
})
export class FileModule {}
