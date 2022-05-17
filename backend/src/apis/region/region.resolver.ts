import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Region } from './entities/region.entity';
import { RegionService } from './region.service';

import axios from 'axios';
import { WeatherOutPut } from './dto/weatherOutput';

@Resolver()
export class RegionResolver {
  constructor(private readonly regionService: RegionService) {}

  @Query(() => Region) // 지역 정보 조회
  fetchRegion(
    @Args('reagionName')
    regionId: string,
  ) {
    return this.regionService.findOne({ regionId });
  }

  @Query(() => WeatherOutPut) // 날씨 정보 API
  async getWeather(
    @Args('regionName')
    regionId: string,
  ) {
    const region = await this.regionService.findOne({ regionId }); // 지역정보(위도,경도) 불러오기
    const appId = process.env.OPEN_WEATHER_APP_ID; // openWeather API appId

    const result = await axios({
      url: `https://api.openweathermap.org/data/2.5/onecall?lat=${region.lat}&lon=${region.lon}&units=metric&exclude=daily,alerts&appid=${appId}`,
    }); // openWeatherAPI 호출

    const data = result.data; // 전체 데이터

    const current = data.current;
    const minutely = data.minutely[0];
    const hourly = data.hourly[0];
    const weatherObject = current.weather;

    const rainAmount = minutely.precipitation;
    const rainRate = hourly.pop;
    const temp = current.temp;
    const feelsLike = current.feels_like;
    const uvi = current.uvi;
    const status = weatherObject[0].main;
    const weatherDetail = weatherObject[0].description;
    const weatherIcon = weatherObject[0].icon;

    const weatherResult: WeatherOutPut = {
      // 아웃풋 클래스로 타입지정
      rainAmount,
      rainRate,
      temp,
      feelsLike,
      uvi,
      status,
      weatherDetail,
      weatherIcon,
    };
    console.log(weatherResult);
    return weatherResult;
  }

  @Mutation(() => Region) // 지역 정보 생성
  createRegion(
    @Args('regionId')
    regionId: string,
    @Args('lat')
    lat: string,
    @Args('lon')
    lon: string,
  ) {
    return this.regionService.create({ regionId, lat, lon });
  }

  @Mutation(() => Region) // 지역정보 업데이트
  updateRegion(
    @Args('regionId')
    regionId: string,
    @Args('lat')
    lat: string,
    @Args('lon')
    lon: string,
  ) {
    return this.regionService.update({ regionId, lat, lon });
  }
}
