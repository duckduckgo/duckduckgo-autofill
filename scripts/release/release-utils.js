/**
 * Execs a string.replace and ensures the searchRegex is found
 * @param {string} file
 * @param {RegExp} searchRegex - Use groupings for more complex operations
 * @param {string} replace
 * @returns {string}
 * @throws {Error} - If the file does not contain the searchRegex
 */
function replaceInFile (file, searchRegex, replace) {
    if (!searchRegex.test(file)) {
        const errorMsg = 'The source file does not seem to contain a match for the regex. Check the file and the regex'
        console.log(errorMsg)
        console.log(file)
        throw new Error(errorMsg)
    }
    return file.replace(
        searchRegex,
        replace
    )
}

module.exports = {replaceInFile}
