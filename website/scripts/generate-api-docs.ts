import { readdirSync, readFileSync, writeFileSync, renameSync } from 'fs';
import { resolve } from 'path';
import { Application } from 'typedoc';

const packagesDir = resolve(__dirname, '..', '..', 'packages');
const websiteDir = resolve(__dirname, '..', '..', 'website');
const apiDocsDir = resolve(__dirname, '..', '..', 'website', 'docs', 'api');

let dirs = readdirSync(packagesDir);

// Do not build the docs for these packages
const excludeDirs = ['database-tests', 'e2e', 'error', 'types'];

const app = new Application();

// Config for typedoc;
app.bootstrap({
  theme: 'docusaurus2',
  mode: 'file',
  ignoreCompilerErrors: true,
  excludePrivate: true,
  excludeNotExported: true,
  tsconfig: 'tsconfig.json',
  plugin: ['typedoc-plugin-markdown'],
});

// Do not build the docs for these packages
dirs = dirs.filter((dir) => !excludeDirs.includes(dir));

dirs.forEach((dir) => {
  // Generate the api doc for each package
  app.generateDocs(
    app.expandInputFiles([resolve(packagesDir, dir, 'src')]),
    resolve(apiDocsDir, dir)
  );

  // We move the generated sidebar into the good API folder so they can be reused when the sidebar is generated
  renameSync(
    resolve(websiteDir, 'website', 'sidebars.js'),
    resolve(apiDocsDir, dir, 'sidebars.js')
  );
});

// This is a fix for a generics issue, see https://github.com/tom-grey/typedoc-plugin-markdown/issues/119
const filePath = resolve(apiDocsDir, 'graphql-api', 'globals.md');
let fileContent = readFileSync(filePath, {
  encoding: 'utf8',
});
fileContent = fileContent.replace(
  '= new GraphQLModule<CoreAccountsModuleConfig>',
  '= new GraphQLModule'
);
writeFileSync(filePath, fileContent, { encoding: 'utf8' });

// console.log(`generated docs for packages:`);
// dirs.forEach(dir => {
//   console.log(`"api/${dir}/index",`);
// });
