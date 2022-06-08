import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { CurrentUser } from 'src/commons/auth/gql-user.param';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { FileService } from './file.service';

@Resolver()
export class FileResolver {
  constructor(
    private readonly fileService: FileService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  @Mutation(() => [String])
  uploadFeedImgs(
    @Args({ name: 'imgs', type: () => [GraphQLUpload] })
    imgs: FileUpload[],
  ) {
    return this.fileService.uploadImgs({ imgs });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async uploadUserImg(
    @CurrentUser() currentUser: any,
    @Args({ name: 'img', type: () => GraphQLUpload })
    img: FileUpload,
  ) {
    const uploadResult = await this.fileService.uploadImg({ img });
    const user = await this.userRepository.findOne({
      where: { email: currentUser.email },
    });

    await this.userRepository.save({
      ...user,
      userImgURL: String(uploadResult),
    });
    return uploadResult;
  }
}
