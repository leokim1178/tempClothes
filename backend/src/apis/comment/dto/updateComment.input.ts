import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCommentInput } from './createComment.input';

@InputType()
export class UpdateCommentInput extends PartialType(CreateCommentInput) {}
