#detox test --configuration ios.sim.debug --loglevel trace --record-logs all --take-screenshots failing --record-performance all --capture-view-hierarchy enabled './e2e/tests/launch.test.js'
#detox test --configuration ios.sim.debug --loglevel trace --record-logs all --take-screenshots failing --record-performance all --capture-view-hierarchy enabled --reuse './e2e/tests/login.test.js'
#detox test --configuration ios.sim.debug --loglevel trace --record-logs all --take-screenshots failing --record-performance all --capture-view-hierarchy enabled --reuse './e2e/tests/addMoney_checkout.test.js'
detox test --configuration ios.sim.debug --loglevel info --record-logs all --take-screenshots all  './e2e/tests/PSD-6292.test.js'
detox test --configuration ios.sim.debug --loglevel info --record-logs all --take-screenshots all  './e2e/tests/PSD-6330.test.js'