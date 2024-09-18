detox test --configuration android.att.release --loglevel trace --record-logs all --take-screenshots failing --record-performance all --capture-view-hierarchy enabled './e2e/tests/launch.test.js'
detox test --configuration android.att.release --loglevel trace --record-logs all --take-screenshots failing --record-performance all --capture-view-hierarchy enabled --reuse './e2e/tests/login.test.js'
detox test --configuration android.att.release --loglevel trace --record-logs all --take-screenshots failing --record-performance all --capture-view-hierarchy enabled --reuse './e2e/tests/addMoney_checkout.test.js'
detox test --configuration android.att.release --loglevel trace --record-logs all --take-screenshots failing --record-performance all --capture-view-hierarchy enabled --reuse './e2e/tests/sendmoney.test.js'

detox test -c android.emu.release --loglevel trace --record-logs all --record-videos all --maxWorkers 2