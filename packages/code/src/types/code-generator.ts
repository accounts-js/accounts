export interface CodeGenerator {
  generate(): Promise<string>;
}
