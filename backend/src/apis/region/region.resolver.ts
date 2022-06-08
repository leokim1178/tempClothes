import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Region } from './entities/region.entity';
import { RegionService } from './region.service';

import axios from 'axios';
import { WeatherOutPut } from './dto/weatherOutput';
import { CACHE_MANAGER, Inject, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Resolver()
export class RegionResolver {
  constructor(
    private readonly regionService: RegionService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Query(() => Region)
  fetchRegion(
    @Args('reagionName') regionId: string, //
  ) {
    return this.regionService.findOne({ regionId });
  }

  @Query(() => WeatherOutPut)
  async getWeather(
    @Args('regionName') regionId: string, //
  ) {
    try {
      const redis = await this.cacheManager.get(regionId);
      if (redis) return redis;
      else {
        const region = await this.regionService.findOne({ regionId });
        if (!region) throw new NotFoundException('지역명이 존재하지 않습니다');

        const appId = process.env.OPEN_WEATHER_APP_ID;

        const result = await axios({
          url: `https://api.openweathermap.org/data/2.5/onecall?lat=${region.lat}&lon=${region.lon}&units=metric&exclude=daily,alerts&appid=${appId}`,
        });

        const data = result.data;

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
      throw error;
    }
  }

  @Mutation(() => Region)
  createRegion(
    @Args('regionId') regionId: string, //
    @Args('lat') lat: string,
    @Args('lon') lon: string,
  ) {
    return this.regionService.create({ regionId, lat, lon });
  }

  @Mutation(() => Region)
  updateRegion(
    @Args('regionId') regionId: string, //
    @Args('lat') lat: string,
    @Args('lon') lon: string,
  ) {
    return this.regionService.update({ regionId, lat, lon });
  }

  @Mutation(() => Boolean)
  deleteRegion(
    @Args('regionId') regionId: string, //
  ) {
    return this.regionService.delete({ regionId });
  }
}
