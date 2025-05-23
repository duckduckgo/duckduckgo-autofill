/* eslint-disable camelcase */
const timersPromises = require('node:timers/promises');
const Asana = require('asana');
const MarkdownIt = require('markdown-it');
const { getLink } = require('./release-utils.js');
const md = new MarkdownIt();

const ASANA_ACCESS_TOKEN = process.env.ASANA_ACCESS_TOKEN;
const commit = process.env.GITHUB_SHA;
const version = process.env.VERSION;
const releaseUrl = process.env.RELEASE_URL || '';
const releaseNotesRaw = process.env.RELEASE_NOTES;
const releaseNotes = md.render(releaseNotesRaw);

const templateTaskGid = '1200547430029363';
const autofillProjectGid = '1198964220583541';
const releaseSectionGid = '1200559726959935';
const projectExtractorRegex = /\[\[project_gids=(.+)]]\s/;

/**
 * @typedef {{taskGid: string, taskUrl: string, displayName: string}} platformData
 *
 * @typedef {{
 *   android: platformData,
 *   apple: platformData,
 *   windows: platformData
 * }} AsanaOutput
 */

/** @type {AsanaOutput} */
const platforms = {
    android: {
        displayName: 'Android',
        taskGid: '',
        taskUrl: '',
    },
    apple: {
        displayName: 'Apple',
        taskGid: '',
        taskUrl: '',
    },
    windows: {
        displayName: 'Windows',
        taskGid: '',
        taskUrl: '',
    },
};

let asana;

const setupAsana = () => {
    asana = Asana.Client.create({
        defaultHeaders: {
            'Asana-Enable': 'new_project_templates,new_user_task_lists,new_goal_memberships',
        },
    }).useAccessToken(ASANA_ACCESS_TOKEN);
};

const duplicateTemplateTask = (templateTaskGid) => {
    const duplicateOption = {
        include: ['notes', 'assignee', 'subtasks', 'projects'],
        name: `Autofill release ${version}`,
        opt_fields: 'html_notes',
    };

    return asana.tasks.duplicateTask(templateTaskGid, duplicateOption);
};

const waitForJobSuccess = async (job_gid) => {
    const interval = 1000;
    const maxAttempts = 20;

    return new Promise((resolve, reject) => {
        const innerFn = async function (job_gid, attempts) {
            console.error(`Waiting for job ${job_gid} to complete...`);
            const { status } = await asana.jobs.getJob(job_gid);
            console.error(`Job ${job_gid} status: ${status}`);
            if (status === 'succeeded') {
                return resolve(status);
            }
            attempts += 1;

            if (attempts > maxAttempts) {
                const errMsg = `The job ${job_gid} took too long to execute`;
                console.error(errMsg);
                return reject(new Error(errMsg));
            }

            console.error(`Retrying in ${interval}ms...`);
            await timersPromises.setTimeout(interval);
            console.error(`Attempt ${attempts}`);
            return innerFn(job_gid, attempts);
        };
        return innerFn(job_gid, 1);
    });
};

const asanaCreateTasks = async () => {
    setupAsana();

    // Duplicating template task...
    const { new_task, gid: duplicateTaskJobGid } = await duplicateTemplateTask(templateTaskGid);

    const { html_notes: notes } = await asana.tasks.getTask(new_task.gid, { opt_fields: 'html_notes' });

    const updatedNotes = notes
        .replace('[[version]]', version)
        .replace('[[commit]]', commit)
        .replace('[[release_url]]', getLink(releaseUrl, 'Autofill Release'))
        .replace('[[notes]]', releaseNotes)
        .replace(/<\/?p>/gi, '\n')
        // Asana supports only h1 and h2
        .replace(/<(h3|h4)>/gi, '<h2>')
        .replace(/<\/(h3|h4)>/gi, '</h2>');

    // Updating task and moving to Release section...
    await asana.tasks.updateTask(new_task.gid, { html_notes: updatedNotes });

    await asana.tasks.addProjectForTask(new_task.gid, { project: autofillProjectGid, section: releaseSectionGid });

    // The duplicateTask job returns when the task itself has been duplicated, ignoring the subtasks.
    // We want to wait that the job completes so that we can fetch all the subtasks correctly.
    await waitForJobSuccess(duplicateTaskJobGid);

    // Getting subtasks...
    const { data: subtasks } = await asana.tasks.getSubtasksForTask(new_task.gid, { opt_fields: 'name,html_notes,permalink_url' });

    // Updating subtasks and moving to appropriate projects...
    for (const subtask of subtasks) {
        const { gid, name, html_notes, permalink_url } = subtask;

        const platform = Object.keys(platforms).find((key) => name.includes(platforms[key].displayName));
        if (!platform) throw new Error('Unexpected platform name: ' + name);

        platforms[platform].taskGid = gid;
        platforms[platform].taskUrl = permalink_url;

        const newName = name.replace('[[version]]', version);
        const projectGids = (html_notes.match(projectExtractorRegex)?.[1] || '').split(',');

        const subtaskNotes = html_notes.replace(projectExtractorRegex, '').replace('[[notes]]', updatedNotes);

        await asana.tasks.updateTask(gid, { name: newName, html_notes: subtaskNotes });

        for (const projectGid of projectGids) {
            await asana.tasks.addProjectForTask(gid, { project: projectGid });
        }
    }

    const finalNotes = updatedNotes.replace('<li>[[pr_url]]</li>', version).replace('<li>[[extra_content]]</li>', version);

    await asana.tasks.updateTask(new_task.gid, { html_notes: finalNotes });

    const jsonString = JSON.stringify(platforms);
    return { stdout: jsonString };
};

asanaCreateTasks()
    .then((result) => {
        // The log is needed to read the value from the bash context
        console.log(result.stdout);
    })
    .catch((e) => {
        // The Asana API returns errors in e.value.errors. If that's undefined log whatever else we got
        console.error(e.value?.errors || e);
        process.exit(1);
    });

module.exports = { asanaCreateTasks };
