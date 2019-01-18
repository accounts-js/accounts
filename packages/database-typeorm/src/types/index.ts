import { Entity } from 'typeorm';

export interface AccountsTypeormOptions {
  userEntity: typeof Entity;
  userServiceEntity: typeof Entity;
  userEmailEntity: typeof Entity;
  userSessionEntity: typeof Entity;
}
