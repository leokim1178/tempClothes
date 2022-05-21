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

  @Field(() => String) // 나중에 weather api 쓸때, 다시 검토(미리 아이디를 설정 or 다른 방법)
  regionId: string; // DB에 미리 데이터를 넣어 놓는다.
}
