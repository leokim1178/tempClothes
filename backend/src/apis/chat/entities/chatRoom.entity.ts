import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  room: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
