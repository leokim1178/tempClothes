import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { ChatMessage } from './chatMessage.entity';

@Entity()
@ObjectType()
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  room: string;

  @ManyToMany(() => ChatMessage, (chatMessage) => chatMessage.chatRoom, {
    nullable: true,
  })
  @Field(() => [ChatMessage])
  chatMessage: ChatMessage[];

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
