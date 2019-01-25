import { Entity, Column, ManyToOne, Unique, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class UserEmail {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ManyToOne(() => User, user => user.emails, { onDelete: 'CASCADE' })
  public user!: User;

  @Unique(['address'])
  @Column()
  public address!: string;

  @Column({ default: false })
  public verified!: boolean;

  @Column({ nullable: true })
  public userId!: string;
}
