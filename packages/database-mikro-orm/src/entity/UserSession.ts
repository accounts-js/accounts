import { Entity, Property, ManyToOne, PrimaryKey, IdentifiedReference, Reference } from 'mikro-orm';
import { User } from './User';

type UserSessionConstructor = {
  user: User;
  token: string;
  valid: boolean;
  userAgent?: string | null;
  ip?: string | null;
  extra?: object;
};

@Entity()
export class UserSession {
  @PrimaryKey()
  id!: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne(() => User, { wrappedReference: true })
  user: IdentifiedReference<User>;

  @Property()
  token: string;

  @Property()
  valid: boolean;

  @Property({ nullable: true })
  userAgent?: string;

  @Property({ nullable: true })
  ip?: string;

  @Property({ type: 'json', nullable: true })
  extra?: object;

  constructor({ user, token, valid, userAgent, ip, extra }: UserSessionConstructor) {
    this.user = Reference.create(user);
    this.token = token;
    this.valid = valid;
    if (userAgent) {
      this.userAgent = userAgent;
    }
    if (ip) {
      this.ip = ip;
    }
    if (extra) {
      this.extra = extra;
    }
  }
}
