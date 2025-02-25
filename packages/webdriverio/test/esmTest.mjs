import defaultExport from '../dist/index.mjs';
import assert from 'assert';
import * as webdriverio from 'webdriverio';
import { fileURLToPath, pathToFileURL } from 'url';
import { join } from 'path';

const exportIsFunction = typeof defaultExport === 'function';
assert(exportIsFunction, 'export is not a function');

async function integrationTest() {
  let path = fileURLToPath(new URL('.', import.meta.url));
  path = join(path, '../fixtures/external/index.html');

  const options = {
    automationProtocol: 'devtools',
    path: '/',
    capabilities: {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless']
      }
    },
    logLevel: 'error'
  };
  const client = await webdriverio.remote(options);
  await client.url(pathToFileURL(path).toString());

  const results = await new defaultExport({ client }).analyze();
  assert(results.violations.length > 0, 'could not find violations');
  process.exit(0);
}
integrationTest();
