const {readFileSync, writeFileSync} = require('fs')
const {join} = require('path')
const {replaceInString} = require('./release-utils.js')
const cwd = join(__dirname, '..')
const filepath = (...path) => join(cwd, ...path)
const platform = process.argv[2]

const commit = process.env.BSK_SHA

function updateAppleDeviceRepo (platform = 'ios') {
    console.log(`running updateAppleDeviceRepo for ${platform}`)

    const projectFilePath = filepath(`../../${platform}/DuckDuckGo.xcodeproj/project.pbxproj`)
    const bskPackageRegex = new RegExp(
        /(repositoryURL = "https:\/\/github\.com\/duckduckgo\/BrowserServicesKit";\s+requirement = {\s+kind = )(exactVersion)(;\s+)(version = \d+.\d+.\d+;)/
    )

    const projectFile = readFileSync(projectFilePath, 'utf8')
    const updatedProjectFile = replaceInString(
        projectFile,
        bskPackageRegex,
        `$1revision$3revision = ${commit};`
    )
    writeFileSync(projectFilePath, updatedProjectFile)
    console.log(`BSK reference updated in ${platform} repo`)
}

updateAppleDeviceRepo(platform)
