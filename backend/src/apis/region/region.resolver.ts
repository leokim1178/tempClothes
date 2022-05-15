import { Args, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { Region } from './entities/region.entity';
import { RegionService } from './region.service';

import axios from 'axios';
import { WeatherOutPut } from './dto/weather.output';

@Resolver()
export class RegionResolver {
  constructor(private readonly regionService: RegionService) {}

  @Query(() => Region)
  fetchRegion(
    @Args('reagionName')
    regionName: string,
  ) {
    return this.regionService.findOne({ regionName });
  }

  @Mutation(() => Region)
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

  @Mutation(() => Region)
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

  @Query(() => WeatherOutPut)
  async getWeather(
    @Args('regionName')
    regionName: string,
  ) {
    const region = await this.regionService.findOne({ regionName });

    const appId = process.env.OPEN_WEATHER_APP_ID;

    const result = await axios({
      url: `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${region.lat}&lon=${region.lon}&appid=${appId}`,
    });

    const data = result.data;
    const weatherDetail = data.weather[0].description;
    const weatherIcon = data.weather[0].icon;
    const status = data.weather[0].main;
    const feelsLike = data.main.feels_like;
    const temp = data.main.temp;
    const tempMin = data.main.temp_min;
    const tempMax = data.main.temp_max;
    const humidity = data.main.humidity;

    const weatherResult: WeatherOutPut = {
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
}
