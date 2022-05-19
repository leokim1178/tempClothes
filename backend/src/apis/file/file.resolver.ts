import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FileService } from './file.service';

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}
  @Mutation(() => [String])
  uploadFeedImgs(
    @Args({ name: 'imgs', type: () => [GraphQLUpload] })
    imgs: FileUpload[],
  ) {
    return this.fileService.uploadImgs({ imgs });
  }

  @Mutation(() => String)
  uploadUserImg(
    @Args({ name: 'img', type: () => GraphQLUpload })
    img: FileUpload,
  ) {
    return this.fileService.uploadImg({ img });
  }
}
