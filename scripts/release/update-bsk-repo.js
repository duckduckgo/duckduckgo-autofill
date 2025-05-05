const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const cwd = join(__dirname, '..');
const filepath = (...path) => join(cwd, ...path);
const { updatePackageResolved, updatePackageSwift } = require('./release-utils.js');

const autofillCommit = process.env.GITHUB_SHA;
const autofillVersion = process.env.VERSION;

const packageSwiftPath = filepath('../../apple-monorepo/SharedPackages/BrowserServicesKit/Package.swift');
const packageResolvedPath = filepath('../../apple-monorepo/SharedPackages/BrowserServicesKit/Package.resolved');

function updateBSKRepo(version, commit) {
    console.log('running updateBSKrepo');

    if (!version) throw new Error('Version not provided');
    if (!commit) throw new Error('Commit not provided');

    const packageSwift = readFileSync(packageSwiftPath, 'utf8');
    const updatedPackageSwift = updatePackageSwift(packageSwift, version);
    writeFileSync(packageSwiftPath, updatedPackageSwift);
    console.log("Autofill reference updated in BSK's Package.swift");

    const packageResolved = readFileSync(packageResolvedPath, 'utf8');
    const updatedPackageResolve = updatePackageResolved(packageResolved, { autofill: { version, commit } });
    writeFileSync(packageResolvedPath, updatedPackageResolve);
    console.log("Autofill reference updated in BSK's Package.resolved");
}

updateBSKRepo(autofillVersion, autofillCommit);
