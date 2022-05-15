import { InputType, PartialType } from '@nestjs/graphql';
import { createCommentInput } from './createComment.input';

@InputType()
export class updateCommentInput extends PartialType(createCommentInput) {}
