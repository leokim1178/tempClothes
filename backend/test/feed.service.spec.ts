// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Feed } from 'src/apis/feed/entities/feed.entity';
// import { FeedResolver } from 'src/apis/feed/feed.resolver';
// import { FeedService } from 'src/apis/feed/feed.service';
// import { FeedImg } from 'src/apis/feedImg/entities/feedImg.entity';
// import { FeedImgService } from 'src/apis/feedImg/feedImg.service';
// import { FeedLike } from 'src/apis/feedLike/entities/feedLike.entity';
// import { FeedTag } from 'src/apis/feedTag/entities/feedTag.entity';
// import { Region } from 'src/apis/region/entities/region.entity';
// import { User } from 'src/apis/user/entities/user.entity';
// import { Connection, Repository } from 'typeorm';

// type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

// const mockRepository = () => ({
//   findOne: jest.fn(),
//   save: jest.fn(),
//   create: jest.fn(),
//   find: jest.fn(),
//   delete: jest.fn(),
//   createQueryBuilder: jest.fn().mockReturnValue({
//     leftJoinAndSelect: jest.fn().mockReturnThis(),
//     where: jest.fn().mockReturnThis(),
//     orderBy: jest.fn().mockReturnThis(),
//     take: jest.fn().mockReturnThis(),
//     skip: jest.fn().mockReturnThis(),
//     getManyAndCount: jest.fn().mockReturnThis(),
//     andWhere: jest.fn().mockReturnThis(),
//     getOne: jest.fn().mockReturnThis(),
//     update: jest.fn().mockReturnThis(),
//     set: jest.fn().mockReturnThis(),
//     execute: jest.fn().mockReturnValue({ this: 'hi' }),
//   }),
// });

// describe('FeedService', () => {
//   let feedService: FeedService;
//   let feedResolver: FeedResolver;
//   let feedImgService: FeedImgService;
//   let feedRepository: MockRepository<Feed>;
//   let feedTagRepository: MockRepository<FeedTag>;
//   let regionRepository: MockRepository<Region>;
//   let userRepository: MockRepository<User>;
//   let feedImgRepository: MockRepository<FeedImg>;
//   let feedLikeRepository: MockRepository<FeedLike>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         FeedService,
//         FeedResolver,
//         FeedImgService,
//         Connection,
//         {
//           provide: getRepositoryToken(Feed),
//           useValue: mockRepository(),
//         },
//         {
//           provide: getRepositoryToken(FeedTag),
//           useValue: mockRepository(),
//         },
//         {
//           provide: getRepositoryToken(Region),
//           useValue: mockRepository(),
//         },
//         {
//           provide: getRepositoryToken(User),
//           useValue: mockRepository(),
//         },
//         {
//           provide: getRepositoryToken(FeedImg),
//           useValue: mockRepository(),
//         },
//         {
//           provide: getRepositoryToken(FeedLike),
//           useValue: mockRepository(),
//         },
//       ],
//     }).compile();
//     feedService = module.get<FeedService>(FeedService);
//     feedResolver = module.get<FeedResolver>(FeedResolver);
//     feedImgService = module.get<FeedImgService>(FeedImgService);
//     feedRepository = module.get<MockRepository<Feed>>(getRepositoryToken(Feed));
//     feedTagRepository = module.get<MockRepository<FeedTag>>(
//       getRepositoryToken(FeedTag),
//     );
//     regionRepository = module.get<MockRepository<Region>>(
//       getRepositoryToken(Region),
//     );
//     userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
//     feedImgRepository = module.get<MockRepository<FeedImg>>(
//       getRepositoryToken(FeedImg),
//     );
//     feedLikeRepository = module.get<MockRepository<FeedLike>>(
//       getRepositoryToken(FeedLike),
//     );
//   });

//   describe('findWithFeedId', () => {
//     describe('when findWithFeedId is Called', () => {
//       beforeEach(async () => {
//         feedRepository;
//       });
//     });
//   });
// });
