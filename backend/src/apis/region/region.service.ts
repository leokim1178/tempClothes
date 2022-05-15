import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  async findOne({ regionName }) {
    return await this.regionRepository.findOne({ name: regionName });
  }

  async update({ regionId, regionName, lat, lon }) {
    const region = this.regionRepository.findOne({ id: regionId });

    if (!region) throw new ConflictException('존재하지않는 지역아이디입니다');

    const result = this.regionRepository.save({
      ...region,
      id: regionId,
      name: regionName,
      lat,
      lon,
    });
    return result;
  }

  async create({ regionName, lat, lon }) {
    const checkDup = await this.regionRepository.findOne({
      where: {
        name: regionName,
      },
    });

    if (checkDup) throw new ConflictException('이미 등록된 지역명입니다'); // 지역명 중복 확인

    const result = await this.regionRepository.save({
      name: regionName,
      lat,
      lon,
    });
    return result;
  }
}
