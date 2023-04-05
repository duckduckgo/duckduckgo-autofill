/**
 * Execs a string.replace and ensures the searchRegex is found
 * @param {string} string
 * @param {RegExp} searchRegex - Use groupings for more complex operations
 * @param {string} replace
 * @returns {string}
 * @throws {Error} - If the string does not contain the searchRegex
 */
function replaceInString (string, searchRegex, replace) {
    if (!searchRegex.test(string)) {
        const errorMsg = 'No match found in the string. Check both string and regex.'
        console.log(errorMsg)
        console.log(string)
        throw new Error(errorMsg)
    }
    return string.replaceAll(
        new RegExp(searchRegex.source, 'gi'),
        replace
    )
}

/**
 * Execs multiple string.replace and ensures the searchRegexes are found
 * @param {string} string
 * @param {[searchRegex: RegExp, replace?: string][]} changes
 * @returns {string}
 * @throws {Error} - If the string does not contain the searchRegex
 */
function replaceAllInString (string, changes) {
    let updatedFile = string
    for (const [searchRegex, replace = ''] of changes) {
        updatedFile = replaceInString(updatedFile, searchRegex, replace)
    }
    return updatedFile
}

/**
 * Creates an html <a> tag from a url and an optional anchor text
 * @param {string} url
 * @param {string} [anchor]
 * @returns {string}
 */
function getLink (url, anchor) {
    return `<a href="${url}">${anchor || url}</a>`
}

/**
 * Wraps the passed content string within a <li></li>
 * @param {string} content
 * @returns {string}
 */
function wrapInLi (content) {
    return `<li>${content}</li>`
}

/**
 * Provide the source project.pbxproj for iOS and macOS and get it updated with the BSK reference
 * @param {string} projectPbxprojContent
 * @param {string} commit
 * @returns {string}
 */
function updateProjectPbxproj (projectPbxprojContent, commit) {
    const bskPackageRegex = new RegExp(
        /(repositoryURL = "https:\/\/github\.com\/duckduckgo\/BrowserServicesKit";\s+requirement = {\s+kind = )(exactVersion)(;\s+)(version = \d+.\d+.\d+;)/,
        'i'
    )

    return replaceInString(
        projectPbxprojContent,
        bskPackageRegex,
        `$1revision$3revision = ${commit};`
    )
}

/**
 * Provide the source Package.swift for BSK and get it updated with the autofill version
 * @param {string} packageSwiftContent
 * @param {string} version
 * @returns {string}
 */
function updatePackageSwift (packageSwiftContent, version) {
    const autofillPackageSwiftRegex = new RegExp(
        /(\.package\(name: "Autofill", url: "https:\/\/github.com\/duckduckgo\/duckduckgo-autofill\.git", \.exact\(")(.+)("\)\),)/,
        'i'
    )

    return replaceInString(
        packageSwiftContent,
        autofillPackageSwiftRegex,
        `$1${version}$3`
    )
}

/**
 * Provide the source Package.resolved for BSK and get it updated with the autofill version
 * @param {string} packageResolvedContent
 * @param {string} version
 * @param {string} commit
 * @returns {string}
 */
function updatePackageResolved (packageResolvedContent, version, commit) {
    const autofillPackageResolvedRegex = new RegExp(
        /("location" : "https:\/\/github.com\/duckduckgo\/duckduckgo-autofill.git",\s+"state" : {\s+"revision" : ")(\w+)(",\s+"version" : ")([\d.]+)("\s+})/,
        'i'
    )

    return replaceInString(
        packageResolvedContent,
        autofillPackageResolvedRegex,
        `$1${commit}$3${version}$5`
    )
}

module.exports = {
    replaceInString,
    replaceAllInString,
    getLink,
    wrapInLi,
    updatePackageSwift,
    updatePackageResolved,
    updateProjectPbxproj
}
