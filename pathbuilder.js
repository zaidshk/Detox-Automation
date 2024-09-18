const constructSafeFilename = require('../node_modules/detox/src/utils/constructSafeFilename');
const path = require('path');

class MyPathBuilder {
  constructor({ rootDir }) {
    this._rootDir = rootDir;
  }

  static get rootDir() {
    return this._rootDir;
  }

  buildPathForTestArtifact(artifactName, testSummary) {
    if (!testSummary) {
      return this._buildPathForRunArtifact(artifactName);
    }

    /* ... use this._rootDir ... */
    console.log('buildPathForTestArtifact _rootDir', `${this._rootDir}`);
    console.log('buildPathForTestArtifact artifactName', artifactName);
    console.log('buildPathForTestArtifact testSummary', testSummary);

    const testArtifactPath = path.join(
      this._rootDir,
      this._constructDirectoryNameForCurrentRunningTest(testSummary),
      constructSafeFilename('', artifactName),
    );

    return testArtifactPath;

    //return `${this._rootDir}/${artifactName}`
  }

  _buildPathForRunArtifact(artifactName) {
    return path.join(this._rootDir, constructSafeFilename('', artifactName));
  }

  _constructDirectoryNameForCurrentRunningTest(testSummary) {
    const prefix = this._buildTestDirectoryPrefix(testSummary);
    const suffix =
      testSummary.invocations > 1 ? ` (${testSummary.invocations})` : '';
    const testArtifactsDirname = constructSafeFilename(
      prefix,
      testSummary.fullName,
      suffix,
    );

    return testArtifactsDirname;
  }

  _buildTestDirectoryPrefix(testSummary) {
    return this._getStatusSign(testSummary);
  }

  _getStatusSign(testSummary) {
    switch (testSummary.status) {
      case 'passed':
        return 'PASSED_';
      case 'failed':
        return 'FAILED_';
      default:
        return '';
    }
  }
}

module.exports = MyPathBuilder;
