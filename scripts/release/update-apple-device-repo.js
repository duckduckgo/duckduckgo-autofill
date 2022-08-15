const {readFileSync, writeFileSync} = require('fs')
const {join} = require('path')
const cwd = join(__dirname, '..')
const filepath = (...path) => join(cwd, ...path)
const platform = process.argv[2]

const commit = process.env.BSK_SHA

function updateAppleDeviceRepo (platform = 'ios') {
    console.log(`running updateAppleDeviceRepo for ${platform}`)

    const projectFilePath = filepath(`../${platform}/DuckDuckGo.xcodeproj/project.pbxproj`)
    const bskPackageRegex = new RegExp(
        /(repositoryURL = "https:\/\/github\.com\/duckduckgo\/BrowserServicesKit";\s+requirement = {\s+kind = )(exactVersion)(;\s+)(version = 21\.0\.0;)/
    )

    const projectFile = readFileSync(projectFilePath, 'utf8')

    if (!bskPackageRegex.test(projectFile)) {
        const errorMsg = `Project file does not seem to contain the BSK package in ${platform}. Check the file and the regex`
        console.log(errorMsg)
        console.log(projectFile)
        throw new Error(errorMsg)
    }
    const updatedProjectFile = projectFile.replace(
        bskPackageRegex,
        `$1revision$3revision = ${commit};`
    )
    writeFileSync(projectFilePath, updatedProjectFile)
    console.log(`BSK reference updated in ${platform} repo`)
}

updateAppleDeviceRepo(platform)
