import { log } from 'detox';

const { exec } = require('child_process');
// Import Detox globalSetup
const detoxGlobalSetup = require('detox/runners/jest/globalSetup');

export default async function globalSetup() {
  // Perform setup operations here
  log.info('globalSetup');
  // Run Detox globalSetup
  await detoxGlobalSetup();

  // Run custom setup operations
  await startMockServer();
}

function startMockServer() {
  exec('yarn mockserver', (err: any, stdout: any, stderr: any) => {
    log.info('🚀 ⏳ server started completed - ', err, stdout, stderr);
  });
}
