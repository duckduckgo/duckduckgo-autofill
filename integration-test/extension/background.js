/* global globalThis */

let emailProtectionUserData = null
let privateEmailAliasIndex = 0
let incontextSignupPermanentlyDismissedAt

globalThis.setEmailProtectionUserData = (userName) => {
    privateEmailAliasIndex = 0
    emailProtectionUserData = {
        userName,
        get nextAlias () { return `${privateEmailAliasIndex}` }
    }
}

function setNextEmailProtectionAlias () {
    privateEmailAliasIndex = privateEmailAliasIndex + 1
}

function getAddresses () {
    if (!emailProtectionUserData) return null

    return {
        personalAddress: `${emailProtectionUserData.userName}`,
        privateAddress: `${emailProtectionUserData.nextAlias}`
    }
}

globalThis.pixels = []
function firePixel ({pixelName}) {
    // eslint-disable-next-line no-undef
    globalThis.pixels.push(pixelName)
}

function registeredTempAutofillContentScript () {
    return {
        debug: false,
        site: {
            isBroken: false,
            allowlisted: false,
            enabledFeatures: ['autofill', 'incontextSignup']
        }
    }
}

function init () {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.registeredTempAutofillContentScript) {
            return sendResponse(registeredTempAutofillContentScript())
        } else if (message.getAddresses) {
            return sendResponse(getAddresses())
        } else if (message.refreshAlias) {
            setNextEmailProtectionAlias()
            return sendResponse(getAddresses())
        } else if (message.messageType === 'sendJSPixel') {
            return sendResponse(firePixel(message.options))
        } else if (message.messageType === 'getIncontextSignupDismissedAt') {
            return sendResponse({
                success: {
                    permanentlyDismissedAt: incontextSignupPermanentlyDismissedAt,
                    isInstalledRecently: true
                }
            })
        } else if (message.messageType === 'setIncontextSignupPermanentlyDismissedAt') {
            incontextSignupPermanentlyDismissedAt = message.value
            return sendResponse()
        }
    })

    // TODO handle addUserData, logout, contextualAutofill and ddgUserReady messages
}

init()
