import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { UserService } from './UserService';
import { UserEmail } from './UserEmail';
import { UserSession } from './UserSession';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public username!: string;

  @Column('jsonb', { nullable: true })
  public profile?: any;

  @OneToMany(() => UserService, userService => userService.user, { eager: true })
  public allServices!: UserService[];

  @OneToMany(() => UserEmail, userEmail => userEmail.user, { eager: true })
  public emails!: UserEmail[];

  @OneToMany(() => UserSession, userSession => userSession.user, { eager: true })
  public sessions!: UserSession[];

  @Column({ default: false })
  public deactivated!: boolean;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  public services: any = {};

  @AfterLoad()
  public async getServices() {
    this.services = this.allServices.reduce((acc, service) => {
      if (service.name === 'password.reset') {
        acc.password = acc.password || {};
        acc.password.reset = acc.password.reset || [];
        acc.password.reset.push({
          token: service.token,
          ...service.options,
        });
      }
      if (service.name === 'email.verification') {
        acc.email = acc.email || {};
        acc.email.verificationTokens = acc.email.verificationTokens || [];
        acc.email.verificationTokens.push({
          token: service.token,
          ...service.options,
        });
      }
      return acc;
    }, this.services);
  }
}
