import { Entity, Property, ManyToOne, PrimaryKey, IdentifiedReference, Reference } from 'mikro-orm';
import { User } from './User';

type UserServiceContructor = {
  name: string;
  user?: User;
  password?: string;
};

@Entity()
export class UserService {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User, { wrappedReference: true })
  user!: IdentifiedReference<User>;

  @Property()
  name: string;

  @Property({ nullable: true })
  token?: string;

  @Property({ type: 'json', nullable: true })
  options?: object;

  constructor({ name, user, password }: UserServiceContructor) {
    this.name = name;

    if (user) {
      this.user = Reference.create(user);
    }

    if (password) {
      this.options = { bcrypt: password };
    }
  }
}
