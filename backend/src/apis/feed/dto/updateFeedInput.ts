import { InputType, PartialType } from '@nestjs/graphql';
import { CreateFeedInput } from './createFeedInput';

@InputType()
export class UpdateFeedInput extends PartialType(CreateFeedInput) {}
