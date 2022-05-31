import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
@ObjectType()
export class Chat {
  @PrimaryGeneratedColumn('increment')
  @Field(() => String)
  id: string; // 룸 번호??가 될 수 있을까?

  @Column()
  @Field(() => String)
  room: string;

  @Column({ type: 'longtext', nullable: true })
  @Field(() => String)
  message?: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  @Field(() => Date)
  deletedAt: Date;
}
