/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Entity,
  Property,
  ManyToOne,
  PrimaryKey,
  IdentifiedReference,
  Unique,
  Reference,
} from 'mikro-orm';
import { User } from './User';

interface UserEmailContructor {
  address: string;
  user?: User;
  verified?: boolean;
}

@Entity()
export class UserEmail {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User, { wrappedReference: true })
  user!: IdentifiedReference<User>;

  @Property()
  @Unique()
  address: string;

  @Property()
  verified: boolean = false;

  constructor({ address, user, verified }: UserEmailContructor) {
    this.address = address.toLocaleLowerCase();
    if (user) {
      this.user = Reference.create(user);
    }
    if (verified) {
      this.verified = verified;
    }
  }
}
