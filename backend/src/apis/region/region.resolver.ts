import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Region } from './entities/region.entity';
import { RegionService } from './region.service';

import axios from 'axios';
import { WeatherOutPut } from './dto/weatherOutput';
import {
  CACHE_MANAGER,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Resolver()
export class RegionResolver {
  constructor(
    //
    private readonly regionService: RegionService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

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
    try {
      const redis = await this.cacheManager.get(regionId);
      if (redis) return redis;
      else {
        const region = await this.regionService.findOne({ regionId }); // 지역정보(위도,경도) 불러오기
        if (!region) throw new NotFoundException('지역명이 존재하지 않습니다');

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
        await this.cacheManager.set(regionId, weatherResult, { ttl: 300 });
        return weatherResult;
      }
    } catch (error) {
      if (error.status == 404) throw new NotFoundException(error.message);

      throw new InternalServerErrorException('날씨 정보 전송 속도 오류');
    }
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
