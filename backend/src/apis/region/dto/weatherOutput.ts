import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WeatherOutPut {
  @Field(() => String)
  status: string;

  @Field(() => String)
  weatherDetail: string;

  @Field(() => String)
  weatherIcon: string;

  @Field(() => Float)
  rainAmount: number;

  @Field(() => Float)
  rainRate: number;

  @Field(() => Float)
  temp: number;

  @Field(() => Float)
  feelsLike: number;

  @Field(() => Float)
  uvi: number;
}
