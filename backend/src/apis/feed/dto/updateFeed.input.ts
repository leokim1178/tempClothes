import { InputType, PartialType } from '@nestjs/graphql';
import { CreateFeedInput } from './createFeed.input';

@InputType()
export class UpdateFeedInput extends PartialType(CreateFeedInput) {}
