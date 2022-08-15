const {readFileSync, writeFileSync} = require('fs')
const {join} = require('path')
const cwd = join(__dirname, '..')
const filepath = (...path) => join(cwd, ...path)

const commit = process.env.GITHUB_SHA
const version = process.env.VERSION

const packageSwiftPath = filepath('../bsk/Package.swift')
const autofillPackageSwiftRegex = new RegExp(
    /(\.package\(name: "Autofill", url: "https:\/\/github.com\/duckduckgo\/duckduckgo-autofill\.git", \.exact\(")(.+)("\)\),)/
)
const packageResolvedPath = filepath('../bsk/Package.resolved')
const autofillPackageResolvedRegex = new RegExp(
    /("package": "Autofill",\s+"repositoryURL": "https:\/\/github.com\/duckduckgo\/duckduckgo-autofill.git",\s+"state": {\s+"branch": null,\s+"revision": ")(\w+)(",\s+"version": ")([\d.]+)("\s+})/
)

function updateBSKRepo () {
    const packageSwift = readFileSync(packageSwiftPath, 'utf8')

    if (!autofillPackageSwiftRegex.test(packageSwift)) {
        const errorMsg = 'Package.swift does not seem to contain the autofill package. Check the file and the regex'
        console.log(errorMsg)
        console.log(packageSwift)
        throw new Error(errorMsg)
    }
    const updatedPackageSwift = packageSwift.replace(
        autofillPackageSwiftRegex,
        `$1${version}$3`
    )
    writeFileSync(packageSwiftPath, updatedPackageSwift)
    console.log('Autofill reference updated in BSK\'s Package.swift')

    const packageResolved = readFileSync(packageResolvedPath, 'utf8')
    if (!autofillPackageResolvedRegex.test(packageResolved)) {
        throw new Error('Package.resolved does not seem to contain the autofill package. Check the file and the regex')
    }
    const updatedPackageResolve = packageResolved.replace(
        autofillPackageResolvedRegex,
        `$1${commit}$3${version}$5`
    )

    writeFileSync(packageResolvedPath, updatedPackageResolve)
    console.log('Autofill reference updated in BSK\'s Package.resolved')
}

updateBSKRepo()
