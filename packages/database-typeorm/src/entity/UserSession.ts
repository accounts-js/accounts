import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ManyToOne(() => User, user => user.sessions, { onDelete: 'CASCADE' })
  public user!: User;

  @Column()
  public token!: string;

  @Column()
  public valid!: boolean;

  @Column({ nullable: true })
  public userAgent?: string;

  @Column({ nullable: true })
  public ip?: string;

  @Column('jsonb', { nullable: true })
  public extra?: object;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  public userId!: string;
}
