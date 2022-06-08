import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class createUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  gender: string;

  @Field(() => String)
  style: string;

  @Field(() => String)
  nickname: string;

  @Field(() => String, { nullable: true })
  userImgURL?: string;

  @Field(() => String)
  regionId: string;
}
