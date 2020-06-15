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

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  public user!: User;

  @Column()
  public token!: string;

  @Column()
  public valid!: boolean;

  @Column({ type: 'text', nullable: true })
  public userAgent?: string | null;

  @Column({ type: 'text', nullable: true })
  public ip?: string | null;

  @Column('jsonb', { nullable: true })
  public extra?: Record<string, unknown>;

  @CreateDateColumn()
  public createdAt!: string;

  @UpdateDateColumn()
  public updatedAt!: string;

  @Column({ nullable: true })
  public userId!: string;
}
