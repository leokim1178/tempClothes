import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ChatRoom } from './chatRoom.entity';

@Entity()
@ObjectType()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'longtext' })
  @Field(() => String)
  message: string;

  @Column()
  @Field(() => String)
  room: string;

  @JoinTable()
  @ManyToMany(() => ChatRoom, (chatRoom) => chatRoom.chatMessage, {
    nullable: true,
  })
  @Field(() => [ChatRoom])
  chatRoom: ChatRoom[];

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
