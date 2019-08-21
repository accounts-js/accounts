import { AuthenticationService, DatabaseInterface, User } from '@accounts/types';
import { AccountsServer } from '@accounts/server';

import { CodeGenerator, CodeProvider, CodeHash, ErrorMessages, CodeLoginType } from './types';
import SimpleCodeHash from './utils/simple-code-hash';
import RandomstringCodeGenerator from './utils/randomstring-code-generator';
import { errors } from './errors';

const DEFAULT_EXPIRY = 20 * 60 * 1000; // 20 minutes in milliseconds

export interface AccountsCodeOptions {
  codeGenerator?: CodeGenerator;
  codeProvider: CodeProvider;
  codeHash?: CodeHash;
  expiry?: number;
  errors?: ErrorMessages;
}

interface DBService {
  id: string;
  code: string;
  expiry: number;
}

const defaultOptions = {
  codeGenerator: new RandomstringCodeGenerator({ length: 4, charset: 'numeric' }),
  codeHash: new SimpleCodeHash() as CodeHash,
  expiry: DEFAULT_EXPIRY,
  errors,
};

export default class CodeService implements AuthenticationService {
  public serviceName = 'code';
  public server!: AccountsServer;
  private db!: DatabaseInterface;
  private options: AccountsCodeOptions & typeof defaultOptions;

  constructor(options: AccountsCodeOptions) {
    this.options = { ...defaultOptions, ...options };
  }

  public setStore(store: DatabaseInterface) {
    this.db = store;
  }

  public async prepareAuthentication(serviceId: string) {
    const user = await this.db.findUserByServiceId(this.serviceName, serviceId);

    if (!user) {
      throw new Error(this.options.errors.userNotFound);
    }

    const newCode = await this.options.codeGenerator.generate();
    const hashedCode = this.options.codeHash.hash(newCode);

    const dbService: DBService = {
      id: serviceId,
      code: hashedCode,
      expiry: Date.now() + this.options.expiry,
    };

    await this.db.setService(user.id, this.serviceName, dbService);

    try {
      await this.options.codeProvider.sendToClient(serviceId, newCode);
    } catch (e) {
      throw new Error(this.options.errors.failedToProvideCode);
    }
  }

  public async authenticate({ serviceId, code }: CodeLoginType): Promise<User> {
    const user = await this.db.findUserByServiceId(this.serviceName, serviceId);

    if (!user) {
      throw new Error(this.options.errors.userNotFound);
    }

    if (!user.services || !(user.services as any)[this.serviceName]) {
      throw new Error(this.options.errors.codeWasNotFound);
    }

    const { code: serviceCode, expiry }: DBService = (user.services as any)[this.serviceName];

    if (serviceCode !== code) {
      throw new Error(this.options.errors.wrongCode);
    }

    if (expiry < Date.now()) {
      throw new Error(this.options.errors.codeExpired);
    }

    return user;
  }
}
