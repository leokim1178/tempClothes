// import {
//   Connection,
//   EntitySubscriberInterface,
//   EventSubscriber,
//   InsertEvent,
//   LoadEvent,
// } from 'typeorm';
// import { FeedResolver } from '../feed.resolver';
// import { FeedService } from '../feed.service';
// import { Feed } from './feed.entity';

// @EventSubscriber()
// export class FeedSubscriber implements EntitySubscriberInterface<Feed> {
//   constructor(
//     connection: Connection,
//     private readonly feedResolver: FeedResolver,
//     private readonly feedService: FeedService,
//   ) {
//     connection.subscribers.push(this);
//   }

//   listenTo() {
//     // console.log('🚀🚀🚀🚀🚀hi this is subscriber');
//     return Feed;
//   }
//   afterInsert(event: InsertEvent<Feed>): void | Promise<any> {
//     console.log('🚀🚀🚀🚀🚀hi this is subscriber');
//   }

// }
