import { InputType, PartialType } from '@nestjs/graphql';
import { createUserInput } from './createUser.input';

@InputType()
export class updateUserInput extends PartialType(createUserInput) {}
