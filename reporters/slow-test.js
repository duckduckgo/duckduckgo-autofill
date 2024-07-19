class JestSlowTestReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
    this._slowTests = [];
  }

  onRunComplete() {
    console.log();
    this._slowTests.sort((a, b) => b.duration - a.duration);
    var rootPathRegex = new RegExp(`^${process.cwd()}`);
    var slowestTests = this._slowTests.slice(0, this._options.numTests || 10);
    var slowTestTime = this._slowTestTime(slowestTests);
    var allTestTime = this._allTestTime();
    var percentTime = (slowTestTime / allTestTime) * 100;

    console.log(
      `Top ${slowestTests.length} slowest examples (${slowTestTime / 1000} seconds,` +
        ` ${percentTime.toFixed(1)}% of total time):`
    );

    for (var i = 0; i < slowestTests.length; i++) {
      var duration = slowestTests[i].duration;
      var fullName = slowestTests[i].fullName;
      var filePath = slowestTests[i].filePath.replace(rootPathRegex, '.');

      console.log(`  ${fullName}`);
      console.log(`    ${duration / 1000} seconds ${filePath}`);
    }
    console.log();
  }

  onTestResult(test, testResult) {
    for (var i = 0; i < testResult.testResults.length; i++) {
      this._slowTests.push({
        duration: testResult.testResults[i].duration,
        fullName: testResult.testResults[i].fullName,
        filePath: testResult.testFilePath,
      });
    }
  }

  _slowTestTime(slowestTests) {
    var slowTestTime = 0;
    for (var i = 0; i < slowestTests.length; i++) {
      slowTestTime += slowestTests[i].duration;
    }
    return slowTestTime;
  }

  _allTestTime() {
    var allTestTime = 0;
    for (var i = 0; i < this._slowTests.length; i++) {
      allTestTime += this._slowTests[i].duration;
    }
    return allTestTime;
  }
}

module.exports = JestSlowTestReporter;
