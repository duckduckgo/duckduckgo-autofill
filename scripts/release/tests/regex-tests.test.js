import { updatePackageResolved, updatePackageSwift } from '../release-utils.js';

const version = '0.0.0_test';
const commit = 'd5ce164fecfaf7ff2324522b1ff7127e61596063';
const bskCommit = 'e7756c9653ce1490be3f625299d1b752421d4834';

describe('Platform replace regexes', () => {
    test('BSK can be updated successfully', () => {
        const examplePackageSwift = `
dependencies: [
    .package(url: "https://github.com/duckduckgo/duckduckgo-autofill.git", exact: "6.4.3"),
    .package(url: "https://github.com/duckduckgo/GRDB.swift.git", exact: "2.1.1"),
]`;
        const examplePackageResolvedForBSK = `
{
    "identity" : "duckduckgo-autofill",
    "kind" : "remoteSourceControl",
    "location" : "https://github.com/duckduckgo/duckduckgo-autofill.git",
    "state" : {
        "revision" : "4aee97d550112ba6551e61ea8019fb1f1a2d3af7",
        "version" : "6.4.3"
    }
}`;

        const updatedPackageSwift = updatePackageSwift(examplePackageSwift, version);
        expect(updatedPackageSwift).toContain(`"https://github.com/duckduckgo/duckduckgo-autofill.git", exact: "${version}"`);

        const updatedPackageResolvedForBSK = updatePackageResolved(examplePackageResolvedForBSK, { autofill: { version, commit } });
        expect(updatedPackageResolvedForBSK).toContain(`"revision" : "${commit}"`);
        expect(updatedPackageResolvedForBSK).toContain(`"version" : "${version}"`);
    });

    test('macOS can be updated successfully', () => {
        const examplePackageResolvedForMacOS = `
{
        "identity" : "browserserviceskit",
        "kind" : "remoteSourceControl",
        "location" : "https://github.com/duckduckgo/apple-browsers",
        "state" : {
            "revision" : "fc9ada07283575e3106e6fc5c670a96c34a86f55",
            "version" : "54.1.0"
        }
    },
    {
        "identity" : "content-scope-scripts",
        "kind" : "remoteSourceControl",
        "location" : "https://github.com/duckduckgo/content-scope-scripts",
        "state" : {
            "revision" : "801b7f23476f797c6eaa72b070e6c80abb82801a",
            "version" : "4.4.4"
        }
    },
    {
        "identity" : "duckduckgo-autofill",
        "kind" : "remoteSourceControl",
        "location" : "https://github.com/duckduckgo/duckduckgo-autofill.git",
        "state" : {
            "revision" : "4aee97d550112ba6551e61ea8019fb1f1a2d3af7",
            "version" : "6.4.3"
        }
    },`;

        const substitutions = {
            autofill: { version, commit },
            bsk: { commit: bskCommit },
        };
        const updatedPackageResolvedForMacOS = updatePackageResolved(examplePackageResolvedForMacOS, substitutions);
        expect(updatedPackageResolvedForMacOS).toContain(`"revision" : "${commit}"`);
        expect(updatedPackageResolvedForMacOS).toContain(`"version" : "${version}"`);
        expect(updatedPackageResolvedForMacOS).toContain(`"revision" : "${bskCommit}"`);
    });
});
