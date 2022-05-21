import { Field, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  DeleteDateColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Region } from 'src/apis/region/entities/region.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column() // 패스워드는 반환이 되면 안됨
  password: string;

  @Column({ nullable: false })
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

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  userImgURL: string;

  @Column({ default: 0 }) // boolean형 일때는 true/false
  @Field(() => Int)
  button: number;

  @ManyToOne(() => Region)
  @Field(() => Region)
  region: Region;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt: Date;
}
