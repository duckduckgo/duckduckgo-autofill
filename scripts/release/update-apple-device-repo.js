const {readFileSync, writeFileSync} = require('fs')
const {join} = require('path')
const {updateProjectPbxproj} = require('./release-utils.js')
const cwd = join(__dirname, '..')
const filepath = (...path) => join(cwd, ...path)
const platform = process.argv[2]

const bskCommit = process.env.BSK_SHA

function updateAppleDeviceRepo (platform = 'ios', commit) {
    console.log(`running updateAppleDeviceRepo for ${platform}`)

    if (!commit) throw new Error('Commit not provided')

    const projectFilePath = filepath(`../../${platform}/DuckDuckGo.xcodeproj/project.pbxproj`)

    const projectFile = readFileSync(projectFilePath, 'utf8')
    const updatedProjectFile = updateProjectPbxproj(projectFile, commit)
    writeFileSync(projectFilePath, updatedProjectFile)
    console.log(`BSK reference updated in ${platform} repo`)
}

updateAppleDeviceRepo(platform, bskCommit)
