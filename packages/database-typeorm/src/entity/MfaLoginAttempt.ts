import { Entity, Column, PrimaryColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class MfaLoginAttempt {
  @PrimaryColumn()
  public id!: string;

  @Column()
  public mfaToken!: string;

  @Column()
  public loginToken!: string;

  @Column()
  public userId!: string;

  @CreateDateColumn()
  public createdAt!: string;

  @UpdateDateColumn()
  public updatedAt!: string;
}
