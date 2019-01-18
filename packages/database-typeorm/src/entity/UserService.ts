import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class UserService {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ManyToOne(() => User, user => user.services, { onDelete: 'CASCADE' })
  public user!: User;

  @Column()
  public name!: string;

  @Column({ nullable: true })
  public token?: string;

  @Column('jsonb', { nullable: true })
  public options: { bcrypt: string } | any;

  public userId!: string;
}
