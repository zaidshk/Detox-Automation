import { log } from 'detox';

const { exec } = require('child_process');
// Import Detox globalTeardown
const detoxGlobalTearDown = require('detox/runners/jest/globalTeardown');

export default async function globalTeardown() {
  log.info('globalTeardown');

  // Import Detox globalTearDown
  detoxGlobalTearDown();
  stopMockServer();
}

function stopMockServer() {
  // Perform teardown operations here
  exec('lsof -i :3000', async (err: any, stdout: any, stderr: any) => {
    log.info('list of process for port 3000 ', err, stdout, stderr);
    const stdoutArray = stdout.split('\n');
    log.info('PID', stdoutArray);
    stdoutArray.forEach(async (std: any) => {
      log.info('std **', std);
      if (std.includes('LISTEN')) {
        const regex = /[0-9]+/;
        const matches = std.match(regex);
        log.info('PID **', matches?.[0]);
        exec(
          'kill -9 ' + matches?.[0],
          (err: any, stdout: any, stderr: any) => {
            log.info(
              '🚫 🟥 ⌛ Stopped Server at port 3000 ',
              err,
              stdout,
              stderr,
            );
          },
        );
      }
    });
  });
}
