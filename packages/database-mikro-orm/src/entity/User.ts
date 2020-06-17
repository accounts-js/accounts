/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Entity, Property, OneToMany, Collection, PrimaryKey } from 'mikro-orm';
import { UserService } from './UserService';
import { UserEmail } from './UserEmail';
import { UserSession } from './UserSession';

export interface UserConstructor {
  userEmailEntity?: typeof UserEmail;
  userServiceEntity?: typeof UserService;
  email?: string;
  password?: string;
  username?: string;
  [additionalKey: string]: any;
}

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  username?: string;

  @OneToMany(() => UserService, (service) => service.user)
  services: Collection<UserService> = new Collection<UserService>(this);

  @OneToMany(() => UserEmail, (email) => email.user)
  emails: Collection<UserEmail> = new Collection<UserEmail>(this);

  @OneToMany(() => UserSession, (session) => session.user)
  sessions: Collection<UserSession> = new Collection<UserSession>(this);

  @Property()
  deactivated: boolean = false;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor({
    userEmailEntity = UserEmail,
    userServiceEntity = UserService,
    email,
    password,
    username,
    ...otherFields
  }: UserConstructor) {
    if (username) {
      this.username = username;
    }
    if (email) {
      this.emails.add(new userEmailEntity({ address: email }));
    }
    if (password) {
      this.services.add(new userServiceEntity({ name: 'password', password }));
    }
    Object.assign(this, otherFields);
  }
}
