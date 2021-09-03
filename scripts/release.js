/* eslint-disable no-undef */
/* eslint-disable camelcase */
const Asana = require('asana')

const ASANA_ACCESS_TOKEN = env.ASANA_ACCESS_TOKEN
const commit = GITHUB_SHA
const version = github.event.release.tag_name
const releaseUrl = github.event.release.html_url
const releaseNotes = github.event.release.body
const templateTaskGid = '1200547430029363'
const autofillProjectGid = '1198964220583541'
const releaseSectionGid = '1200559726959935'
const projectExtractorRegex = /\[\[project_gid=(\d+)]]\s/

let asana

const setupAsana = () => {
    asana = Asana.Client.create({
        'defaultHeaders': {
            'Asana-Enable': 'new_user_task_lists'
        }
    }).useAccessToken(ASANA_ACCESS_TOKEN)
}

const duplicateTemplateTask = () => {
    const duplicateOption = {
        include: ['notes', 'assignee', 'subtasks', 'projects'],
        name: `Autofill Release ${version}`,
        opt_fields: 'html_notes'
    }

    return asana.tasks.duplicateTask(templateTaskGid, duplicateOption)
}

const run = async () => {
    setupAsana()

    const { new_task } = await duplicateTemplateTask()

    const { html_notes: notes } = await asana.tasks.getTask(new_task.gid, { opt_fields: 'html_notes' })

    const updatedNotes =
        notes.replace('[[version]]', version)
            .replace('[[commit]]', commit)
            .replace('[[release_url]]', `<a href="${releaseUrl}">${releaseUrl}</a>`)
            .replace('[[notes]]', releaseNotes)

    await asana.tasks.updateTask(new_task.gid, {html_notes: updatedNotes})

    await asana.tasks.addProjectForTask(new_task.gid, { project: autofillProjectGid, section: releaseSectionGid })

    const { data: subtasks } = await asana.tasks.getSubtasksForTask(new_task.gid, {opt_fields: 'name,html_notes'})

    for (const subtask of subtasks) {
        const {gid, name, html_notes} = subtask

        const newName = name.replace('[[version]]', version)
        const projectGid = html_notes.match(projectExtractorRegex)[1]

        const subtaskNotes =
            html_notes.replace(projectExtractorRegex, '')
                .replace('[[notes]]', updatedNotes)

        await asana.tasks.updateTask(gid, { name: newName, html_notes: subtaskNotes })

        if (projectGid) {
            await asana.tasks.addProjectForTask(gid, { project: projectGid, insert_after: null })
        }
    }
}

run().catch((e) => {
    console.error(e)
    process.exit(1)
})
