import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Application } from 'typedoc';

const packagesDir = resolve(__dirname, '../', 'packages');
const apiDocsDir = resolve(__dirname, '../', 'docs', 'api');

let dirs = readdirSync(packagesDir);

// Do not build the docs for these packages
const excludeDirs = ['database-tests', 'e2e', 'error', 'types'];

// Config for typedoc;
const app = new Application({
  theme: 'markdown',
  module: 'commonjs',
  mode: 'file',
  ignoreCompilerErrors: true,
  excludePrivate: true,
  excludeNotExported: true,
  tsconfig: 'tsconfig.json',
});

// Do not build the docs for these packages
dirs = dirs.filter(dir => !excludeDirs.includes(dir));

dirs.forEach(dir => {
  // Generate the api doc for each package
  app.generateDocs(
    app.expandInputFiles([resolve(packagesDir, dir, 'src')]),
    resolve(apiDocsDir, dir)
  );

  // For each generated files we fix the links
  const docFiles = readdirSync(resolve(apiDocsDir, dir));
  docFiles.forEach(file => {
    let fileContent = readFileSync(resolve(apiDocsDir, dir, file), { encoding: 'utf8' });
    fileContent = fileContent.replace(new RegExp('.md', 'g'), '');
    writeFileSync(resolve(apiDocsDir, dir, file), fileContent, { encoding: 'utf8' });
  });
});

// console.log(`generated docs for packages:`);
// dirs.forEach(dir => {
//   console.log(`"api/${dir}/api-readme",`);
// });
