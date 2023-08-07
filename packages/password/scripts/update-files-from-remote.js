const {join} = require('path')
const {writeFileSync} = require('fs')
const { createHash } = require('node:crypto')
const BASE_URL = 'https://raw.githubusercontent.com/apple/password-manager-resources/main/quirks/'

/**
 * This file contains utilities for keeping our password-related files in sync.
 */

/**
 * @typedef {{
 *     displayName: string,
 *     localPath: string,
 *     remoteUrl: string
 *   }} PathObj
 */

/** @type {{[key: string]: PathObj}} */
const paths = {
    rules: {
        localPath: join(__dirname, '..', 'rules.json'),
        remoteUrl: BASE_URL + 'password-rules.json',
        displayName: 'Password rules'
    },
    sharedCreds: {
        localPath: join(__dirname, '..', 'shared-credentials.json'),
        remoteUrl: BASE_URL + 'shared-credentials.json',
        displayName: 'Shared credentials'
    }
}

/**
 * @param {import("fs").PathOrFileDescriptor} outputPath
 * @param {typeof import("../rules.json") | typeof import("../shared-credentials.json")} contents
 */
function update (outputPath, contents) {
    writeFileSync(outputPath, JSON.stringify(contents, null, 2))
}

/**
 * @param {string} url
 * @returns {Promise<any>}
 */
async function download (url) {
    const res = await fetch(url)
    if (res.ok) {
        return res.json()
    } else {
        throw new Error(`fetch for ${url} failed with ${res.status}`)
    }
}

/**
 * Creates a hash of a string using node:crypto
 * @param {string} content
 * @param {string} algo
 * @returns {string}
 * @source https://stackoverflow.com/a/74933512/1948947
 */
function hashText (content, algo = 'sha256') {
    const hashFunc = createHash(algo)
    hashFunc.update(content)
    return hashFunc.digest('hex')
}

/**
 * Compares the sha256 of two given strings
 * @param {string} local
 * @param {string} remote
 * @returns {boolean}
 */
function areFilesDifferent (local, remote) {
    const localSha256 = hashText(JSON.stringify(local))
    const remoteSha256 = hashText(JSON.stringify(remote))
    return localSha256 !== remoteSha256
}

/**
 * Downloads the remote file, checks the SHA diff and updates local if different
 * @param {PathObj} pathObj
 */
function updateFileIfNeeded (pathObj) {
    download(pathObj.remoteUrl)
        .then((remoteFile) => {
            const localFile = require(pathObj.localPath)
            if (areFilesDifferent(localFile, remoteFile)) {
                update(pathObj.localPath, remoteFile)
                console.log(`${pathObj.displayName} updated`)
            } else {
                console.log(`${pathObj.displayName} already up to date`)
            }
        })
        .catch((e) => {
            console.error(e)
            process.exit(1)
        })
}

if (process.argv.includes('--write-json-files')) {
    updateFileIfNeeded(paths.rules)
    updateFileIfNeeded(paths.sharedCreds)
}
