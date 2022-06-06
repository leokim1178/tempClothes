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

  @Column({ nullable: true })
  @Field(() => String)
  phone: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  gender: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
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

  @ManyToOne(() => Region, { nullable: true, onDelete: 'CASCADE' })
  @Field(() => Region, { nullable: true })
  region: Region;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt: Date;
}
