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
  temp: number;

  @Field(() => Float)
  tempMin: number;

  @Field(() => Float)
  tempMax: number;

  @Field(() => Float)
  humidity: number;

  @Field(() => Float)
  feelsLike: number;
}
