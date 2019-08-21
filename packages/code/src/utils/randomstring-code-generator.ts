import randomstring from 'randomstring';

import { CodeGenerator } from '../types';

export type RandomstringOptions = randomstring.GenerateOptions;

export default class RandomstringCodeGenerator implements CodeGenerator {
  private options?: RandomstringOptions;

  constructor(options?: RandomstringOptions) {
    this.options = options;
  }

  public async generate(): Promise<string> {
    return randomstring.generate(this.options);
  }
}
