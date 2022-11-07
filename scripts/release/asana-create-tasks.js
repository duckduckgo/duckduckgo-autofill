/* eslint-disable no-undef */
/* eslint-disable camelcase */
const Asana = require('asana')
const MarkdownIt = require('markdown-it')
const {getLink} = require('./release-utils.js')
const md = new MarkdownIt()

const ASANA_ACCESS_TOKEN = process.env.ASANA_ACCESS_TOKEN
const commit = process.env.GITHUB_SHA
const version = process.env.VERSION
const releaseUrl = process.env.RELEASE_URL || ''
const releaseNotesRaw = process.env.RELEASE_NOTES
const releaseNotes = md.render(releaseNotesRaw)

const templateTaskGid = '1200547430029363'
const autofillProjectGid = '1198964220583541'
const releaseSectionGid = '1200559726959935'
const projectExtractorRegex = /\[\[project_gids=(.+)]]\s/

/**
 * @typedef {{taskGid: string, taskUrl: string, displayName: string}} platformData
 *
 * @typedef {{
 *   extensions: platformData,
 *   android: platformData,
 *   bsk: platformData,
 *   windows: platformData
 * }} AsanaOutput
 */

/** @type {AsanaOutput} */
const platforms = {
    android: {
        displayName: 'Android',
        taskGid: '',
        taskUrl: ''
    },
    bsk: {
        displayName: 'BrowserServicesKit',
        taskGid: '',
        taskUrl: ''
    },
    extensions: {
        displayName: 'Extensions',
        taskGid: '',
        taskUrl: ''
    },
    windows: {
        displayName: 'Windows',
        taskGid: '',
        taskUrl: ''
    }
}

let asana

const setupAsana = () => {
    asana = Asana.Client.create({
        'defaultHeaders': {
            'Asana-Enable': 'new_project_templates,new_user_task_lists'
        }
    }).useAccessToken(ASANA_ACCESS_TOKEN)
}

const duplicateTemplateTask = (templateTaskGid) => {
    const duplicateOption = {
        include: ['notes', 'assignee', 'subtasks', 'projects'],
        name: `Autofill release ${version}`,
        opt_fields: 'html_notes'
    }

    return asana.tasks.duplicateTask(templateTaskGid, duplicateOption)
}

export const asanaCreateTasks = async () => {
    setupAsana()

    // Duplicating template task...
    const { new_task } = await duplicateTemplateTask(templateTaskGid)

    const { html_notes: notes } = await asana.tasks.getTask(new_task.gid, { opt_fields: 'html_notes' })

    const updatedNotes =
        notes.replace('[[version]]', version)
            .replace('[[commit]]', commit)
            .replace('[[release_url]]', getLink(releaseUrl, 'Autofill Release'))
            .replace('[[notes]]', releaseNotes)
            .replace(/<\/?p>/ig, '\n')

    // Updating task and moving to Release section...
    await asana.tasks.updateTask(new_task.gid, {html_notes: updatedNotes})

    await asana.tasks.addProjectForTask(new_task.gid, { project: autofillProjectGid, section: releaseSectionGid })

    // Getting subtasks...
    const { data: subtasks } = await asana.tasks.getSubtasksForTask(new_task.gid, {opt_fields: 'name,html_notes,permalink_url'})

    // Updating subtasks and moving to appropriate projects...
    for (const subtask of subtasks) {
        const {gid, name, html_notes, permalink_url} = subtask

        const platform = Object.keys(platforms).find(
            (key) => name.includes(platforms[key].displayName)
        )
        if (!platform) throw new Error('Unexpected platform name: ' + name)

        platforms[platform].taskGid = gid
        platforms[platform].taskUrl = permalink_url

        const newName = name.replace('[[version]]', version)
        const projectGids = (html_notes.match(projectExtractorRegex)?.[1] || '').split(',')

        const subtaskNotes =
            html_notes.replace(projectExtractorRegex, '')
                .replace('[[notes]]', updatedNotes)

        await asana.tasks.updateTask(gid, { name: newName, html_notes: subtaskNotes })

        for (const projectGid of projectGids) {
            await asana.tasks.addProjectForTask(gid, { project: projectGid, insert_after: null })
        }
    }

    const finalNotes =
        updatedNotes
            .replace('<li>[[pr_url]]</li>', version)
            .replace('<li>[[extra_content]]</li>', version)

    await asana.tasks.updateTask(new_task.gid, {html_notes: finalNotes})

    const jsonString = JSON.stringify(platforms)
    return {stdout: jsonString}
}

asanaCreateTasks()
    .then((result) => {
        // The log is needed to read the value from the bash context
        console.log(result.stdout)
    })
    .catch((e) => {
        // The Asana API returns errors in e.value.errors. If that's undefined log whatever else we got
        console.error(e.value?.errors || e)
        process.exit(1)
    })
