const {readFileSync, writeFileSync} = require('fs')
const {join} = require('path')
const cwd = join(__dirname, '..')
const filepath = (...path) => join(cwd, ...path)

// const version = process.env.VERSION
const version = '4.7.1'

const packageJsonFilePath = filepath('../android/package.json')
const androidPackageRegex = new RegExp(
    /(github:duckduckgo\/duckduckgo-autofill#)([\w.]+)/
)

function updateIOSRepo () {
    const packageJsonFile = readFileSync(packageJsonFilePath, 'utf8')

    if (!androidPackageRegex.test(packageJsonFile)) {
        const errorMsg = 'Package.json file does not seem to contain autofill. Check the file and the regex'
        console.log(errorMsg)
        console.log(packageJsonFile)
        throw new Error(errorMsg)
    }
    const updatedPackageJsonFile = packageJsonFile.replace(
        androidPackageRegex,
        `$1${version}`
    )
    writeFileSync(packageJsonFilePath, updatedPackageJsonFile)
    console.log('android package.json updated')
}

updateIOSRepo()
