import { AuthenticationService, DatabaseInterface, User } from '@accounts/types';
import { AccountsServer } from '@accounts/server';

import { createServiceId, createToken, validateToken } from './utils/crypto';
import { StepParams, StepResult, MultiStepLoginParams, ErrorMessages } from './types';
import { errors } from './errors';

export interface AccountsMultiStepOptions {
  errors: ErrorMessages;
}

interface DBService {
  id: string;
  nextStep?: number;
  hashedToken?: string;
}

type AuthenticationServiceArray = {
  0: AuthenticationService;
  1: AuthenticationService;
} & AuthenticationService[];

const defaultOptions = {
  errors,
};

export default class MultiStepAuthenticationService implements AuthenticationService {
  public serviceName = 'multi-step-authentication';
  public server!: AccountsServer;
  private db!: DatabaseInterface;
  private steps: AuthenticationServiceArray;
  private options: AccountsMultiStepOptions & typeof defaultOptions;

  constructor(steps: AuthenticationServiceArray, options?: AccountsMultiStepOptions) {
    this.options = { ...defaultOptions, ...options };

    if (steps.length < 2) {
      throw new Error(this.options.errors.notEnoughAuthenticationServices);
    }

    this.steps = steps;
  }

  public setStore(store: DatabaseInterface) {
    this.db = store;
  }

  public async authenticateStep({ index, serviceId, ...params }: StepParams): Promise<StepResult> {
    if (index === 0) {
      const user = await this.steps[0].authenticate(params);

      if (!user) {
        throw new Error(this.options.errors.userNotFound);
      }

      const newServiceId = createServiceId(user);

      await this.db.setService(user.id, this.serviceName, { id: newServiceId, nextStep: 1 });

      return { nextStep: 1, serviceId: newServiceId };
    } else if (!serviceId) {
      throw new Error(this.options.errors.serviceIdNotProvided);
    }

    const userFromServiceId = await this.db.findUserByServiceId(this.serviceName, serviceId);

    if (
      !userFromServiceId ||
      !userFromServiceId.services ||
      !(userFromServiceId as any).services[this.serviceName]
    ) {
      throw new Error(this.options.errors.userNotFound);
    }

    const dbService: DBService = (userFromServiceId as any).services[this.serviceName];

    if (index !== dbService.nextStep) {
      throw new Error(this.options.errors.wrongStep);
    }

    const userAfterAuthentication = await this.steps[index].authenticate(params);

    if (!userAfterAuthentication) {
      throw new Error(this.options.errors.userNotFound);
    }

    if (index !== this.steps.length - 1) {
      const nextStep = index + 1;
      await this.db.setService(userAfterAuthentication.id, this.serviceName, {
        id: serviceId,
        nextStep,
      });

      return { nextStep, serviceId };
    }

    const { token, hash } = createToken();

    await this.db.setService(userAfterAuthentication.id, this.serviceName, {
      id: serviceId,
      hashedToken: hash,
    });

    return { serviceId, token };
  }

  public async authenticate({ serviceId, token }: MultiStepLoginParams): Promise<User> {
    const user = await this.db.findUserByServiceId(this.serviceName, serviceId);

    if (!user || !user.services || !(user as any).services[this.serviceName]) {
      throw new Error(this.options.errors.userNotFound);
    }

    const dbService: DBService = (user as any).services[this.serviceName];

    if (!dbService.hashedToken) {
      throw new Error(this.options.errors.notReadyForAuthentication);
    }

    if (!validateToken(token, dbService.hashedToken)) {
      throw new Error(this.options.errors.wrongToken);
    }

    return user;
  }
}
