/* eslint-disable no-undef */
/* eslint-disable camelcase */
const Asana = require('asana')
const {replaceAllInString} = require('./release-utils.js')
const {getLink} = require('./release-utils.js')
const {wrapInLi} = require('./release-utils.js')

const ASANA_ACCESS_TOKEN = process.env.ASANA_ACCESS_TOKEN
const prUrls = {
    android: process.env.ANDROID_PR_URL || 'error',
    bsk: process.env.BSK_PR_URL || 'error',
    ios: process.env.IOS_PR_URL || 'error',
    macos: process.env.MACOS_PR_URL || 'error'
}
const asanaOutputRaw = process.env.ASANA_OUTPUT || '{}'
const asanaOutput = JSON.parse(asanaOutputRaw)

let asana

const setupAsana = () => {
    asana = Asana.Client.create({
        'defaultHeaders': {
            'Asana-Enable': 'new_project_templates,new_user_task_lists'
        }
    }).useAccessToken(ASANA_ACCESS_TOKEN)
}

const run = async () => {
    setupAsana()

    const platformEntries = Object.entries(asanaOutput)
    for (const [platformName, platformObj] of platformEntries) {
        // If either are absent we haven't implemented the automation for that platform
        if (!platformObj.taskGid || !prUrls[platformName]) continue

        // Get the task
        const { html_notes: notes } = await asana.tasks.getTask(platformObj.taskGid, { opt_fields: 'html_notes' })

        /** @type {[[RegExp, string]]} */
        const taskDescriptionSubstitutions = [
            [/\[\[pr_url]]/, getLink(prUrls[platformName], platformObj.displayName + ' PR')]
        ]

        if (platformName === 'bsk') {
            // On the BSK task we also substitute the ios and macos placeholders
            const markup =
                `${wrapInLi(getLink(prUrls.ios, 'iOS PR:'))}${wrapInLi(getLink(prUrls.macos, 'macOS PR:'))}`
            taskDescriptionSubstitutions.push(
                [/\[\[extra_content]]/, markup]
            )
        } else {
            // For all other platforms we remove the extra placeholder
            taskDescriptionSubstitutions.push(
                [/<li>\[\[extra_content]]<\/li>/, '']
            )
        }

        const updatedNotes = replaceAllInString(notes, taskDescriptionSubstitutions)

        await asana.tasks.updateTask(platformObj.taskGid, { html_notes: updatedNotes })
    }
}

run().catch((e) => {
    // The Asana API returns errors in e.value.errors. If that's undefined log whatever else we got
    console.error(e.value?.errors || e)
    process.exit(1)
})
