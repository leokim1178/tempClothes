import { Args, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { Region } from './entities/region.entity';
import { RegionService } from './region.service';

import axios from 'axios';
import { WeatherOutPut } from './dto/weather.output';

@Resolver()
export class RegionResolver {
  constructor(private readonly regionService: RegionService) {}

  @Query(() => Region) // 지역 정보 조회
  fetchRegion(
    @Args('reagionName')
    regionName: string,
  ) {
    return this.regionService.findOne({ regionName });
  }

  @Query(() => WeatherOutPut) // 날씨 정보 API
  async getWeather(
    @Args('regionName')
    regionName: string,
  ) {
    const region = await this.regionService.findOne({ regionName }); // 지역정보(위도,경도) 불러오기
    const appId = process.env.OPEN_WEATHER_APP_ID; // openWeather API appId

    const result = await axios({
      url: `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${region.lat}&lon=${region.lon}&appid=${appId}`,
    }); // openWeatherAPI 호출

    const data = result.data; // 전체 데이터
    const weatherIcon = data.weather[0].icon; // 기상상태 아이콘
    const status = data.weather[0].main; // 기상상태
    const weatherDetail = data.weather[0].description; // 기상상태상세
    const feelsLike = data.main.feels_like; // 체감온도
    const temp = data.main.temp; // 현재기온
    const tempMin = data.main.temp_min; // 최저기온
    const tempMax = data.main.temp_max; // 최고기온
    const humidity = data.main.humidity; // 습도

    const weatherResult: WeatherOutPut = {
      // 아웃풋 클래스로 타입지정
      status,
      weatherDetail,
      weatherIcon,
      temp,
      tempMin,
      tempMax,
      humidity,
      feelsLike,
    };
    return weatherResult;
  }

  @Mutation(() => Region) // 지역 정보 생성
  createRegion(
    @Args('regionName')
    regionName: string,
    @Args('lat')
    lat: string,
    @Args('lon')
    lon: string,
  ) {
    return this.regionService.create({ regionName, lat, lon });
  }

  @Mutation(() => Region) // 지역정보 업데이트
  updateRegion(
    @Args('regionId')
    regionId: string,
    @Args('regionName')
    regionName: string,
    @Args('lat')
    lat: string,
    @Args('lon')
    lon: string,
  ) {
    return this.regionService.update({ regionId, regionName, lat, lon });
  }
}
