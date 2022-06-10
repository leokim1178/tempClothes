import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

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

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
