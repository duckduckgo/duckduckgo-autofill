const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const { updateProjectPbxproj } = require('./release-utils.js');
const { updatePackageResolved } = require('./release-utils.js');
const cwd = join(__dirname, '..');
const filepath = (...path) => join(cwd, ...path);
const platform = process.argv[2];

const autofillCommit = process.env.GITHUB_SHA || '';
const autofillVersion = process.env.VERSION || '';

const bskCommit = process.env.BSK_SHA || '';

function updateAppleDeviceRepo(platform = 'ios', commit) {
    console.log(`running updateAppleDeviceRepo for ${platform}`);

    if (!commit) throw new Error('Commit not provided');

    const projectFilePath = filepath(`../../${platform}/DuckDuckGo.xcodeproj/project.pbxproj`);

    const projectFile = readFileSync(projectFilePath, 'utf8');
    const updatedProjectFile = updateProjectPbxproj(projectFile, commit);
    writeFileSync(projectFilePath, updatedProjectFile);

    if (platform === 'macos') {
        const packageResolvedPath = filepath('../../macos/DuckDuckGo.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved');

        const substitutions = {
            autofill: {
                version: autofillVersion,
                commit: autofillCommit,
            },
            bsk: {
                commit: bskCommit,
            },
        };

        const packageResolved = readFileSync(packageResolvedPath, 'utf8');
        const updatedPackageResolve = updatePackageResolved(packageResolved, substitutions);
        writeFileSync(packageResolvedPath, updatedPackageResolve);
    }

    console.log(`BSK reference updated in ${platform} repo`);
}

updateAppleDeviceRepo(platform, bskCommit);
