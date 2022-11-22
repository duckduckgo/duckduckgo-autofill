import {updatePackageResolved, updatePackageSwift, updateProjectPbxproj} from '../release-utils.js'

const version = '0.0.0_test'
const commit = 'd5ce164fecfaf7ff2324522b1ff7127e61596063'

describe('Platform replace regexes', () => {
    test('BSK can be updated successfully', () => {
        const examplePackageSwift = `
dependencies: [
    .package(name: "Autofill", url: "https://github.com/duckduckgo/duckduckgo-autofill.git", .exact("5.0.1")),
    .package(name: "GRDB", url: "https://github.com/duckduckgo/GRDB.swift.git", .exact("1.2.0")),
]`
        const examplePackageResolved = `
{
    "package": "Autofill",
    "repositoryURL": "https://github.com/duckduckgo/duckduckgo-autofill.git",
    "state": {
        "branch": null,
        "revision": "d29c5abc7f473b69f3d81d8a15e137ed3aab029d",
        "version": "5.0.1"
    }
}`

        const updatedPackageSwift = updatePackageSwift(examplePackageSwift, version)
        expect(updatedPackageSwift).toContain(`"https://github.com/duckduckgo/duckduckgo-autofill.git", .exact("${version}")`)

        const updatedPackageResolved = updatePackageResolved(examplePackageResolved, version, commit)
        expect(updatedPackageResolved).toContain(`"revision": "${commit}"`)
        expect(updatedPackageResolved).toContain(`"version": "${version}"`)
    })

    test('Apple platforms can be updated successfully', () => {
        const exampleProjectPbxproj = `
98A16C2928A11BDE00A6C003 /* XCRemoteSwiftPackageReference "BrowserServicesKit" */ = {
    isa = XCRemoteSwiftPackageReference;
    repositoryURL = "https://github.com/duckduckgo/BrowserServicesKit";
    requirement = {
        kind = exactVersion;
        version = 32.0.1;
   };
};`

        const updatedProjectPbxproj = updateProjectPbxproj(exampleProjectPbxproj, commit)
        expect(updatedProjectPbxproj).toContain(`kind = revision;`)
        expect(updatedProjectPbxproj).toContain(`revision = ${commit};`)
        expect(updatedProjectPbxproj).not.toContain(`exactVersion`)
    })
})
