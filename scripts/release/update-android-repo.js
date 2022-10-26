const {readFileSync, writeFileSync} = require('fs')
const {join} = require('path')
const {replaceInString} = require('./release-utils.js')
const cwd = join(__dirname, '..')
const filepath = (...path) => join(cwd, ...path)

const version = process.env.VERSION

function updateAndroidRepo () {
    console.log('running updateAndroidRepo')
    const packageJsonFilePath = filepath('../android/package.json')
    const androidPackageRegex = new RegExp(
        /(github:duckduckgo\/duckduckgo-autofill#)([\w.]+)/
    )

    const packageJsonFile = readFileSync(packageJsonFilePath, 'utf8')

    const updatedPackageJsonFile = replaceInString(
        packageJsonFile,
        androidPackageRegex,
        `$1${version}`
    )

    writeFileSync(packageJsonFilePath, updatedPackageJsonFile)
    console.log('android package.json updated')
}

updateAndroidRepo()
