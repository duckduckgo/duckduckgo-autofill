const testcases = [
    'poor-markup-form',
    'etsy',
]

module.exports = testcases.map(testcase => { return [testcase, require('./' + testcase)] })
