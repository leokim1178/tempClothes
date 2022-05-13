import { Field, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Region } from 'src/apis/region/entities/region.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryColumn()
  @Field(() => String)
  userId: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column() // 패스워드는 반환이 되면 안됨
  password: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column()
  @Field(() => String)
  gender: string;

  @Column()
  @Field(() => String)
  style: string;

  @Column()
  @Field(() => String)
  nickname: string;

  // @Column()
  // @Field(() => String)
  // button: string;

  @ManyToOne(() => Region)
  @Field(() => Region)
  region: Region;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
