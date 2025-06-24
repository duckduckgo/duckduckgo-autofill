let mockAsanaClient;
jest.mock('asana', () => {
    const notes = `<h2>New release:<h2>
<ol>
    <li>version [[version]]</li>
    <li>[[commit]]</li>
    <li>[[release_url]]</li>
    <li>[[pr_url]]</li>
    <li>[[extra_content]]</li>
</ol>
<h2>Release notes:</h2>
<p>[[notes]]</p>`;

    mockAsanaClient = {
        useAccessToken: () => mockAsanaClient,
        tasks: {
            getTask: () => ({ html_notes: notes }),
            updateTask: jest.fn(),
        },
    };
    return { Client: { create: () => mockAsanaClient } };
});

beforeEach(() => {
    process.env.ASANA_ACCESS_TOKEN = 'mock-asana-access-token';
    process.env.ANDROID_PR_URL = 'https://github.com/duckduckgo/android/pr/1';
    process.env.APPLE_PR_URL = 'https://github.com/duckduckgo/apple-browsers/pr/1';
    process.env.WINDOWS_PR_URL = 'https://github.com/duckduckgo/windows-browser/pr/1';
    process.env.ASANA_OUTPUT = JSON.stringify({
        android: {
            displayName: 'Android',
            taskGid: 'android-123',
            taskUrl: 'https://example.com/android-task',
        },
        apple: {
            displayName: 'Apple',
            taskGid: 'apple-123',
            taskUrl: 'https://example.com/apple-task',
        },
        extensions: {
            displayName: 'Extensions',
            taskGid: 'extension-123',
            taskUrl: 'https://example.com/extension-task',
        },
        windows: {
            displayName: 'Windows',
            taskGid: 'windows-123',
            taskUrl: 'https://example.com/windows-task',
        },
    });
});

describe('when Asana output is not available', () => {
    beforeEach(() => {
        process.env.ASANA_OUTPUT = undefined;
    });

    it('displays an error message', async () => {
        // @ts-ignore
        const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
        const mockConsole = jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.isolateModules(() => {
            require('../asana-update-tasks.js');
        });
        // Wait for update tasks to run
        await new Promise((resolve) => setTimeout(resolve, 200));

        expect(mockExit).toHaveBeenCalledTimes(1);
        expect(mockConsole).toHaveBeenCalledTimes(1);
        expect(mockConsole.mock.calls).toMatchInlineSnapshot(`
      [
        [
          [Error: Unable to parse Asana output JSON],
        ],
      ]
    `);
    });
});

describe('when not all PR URLs are available', () => {
    beforeEach(() => {
        delete process.env.IOS_PR_URL;
    });

    it('updates each platforms task notes except for missing platforms', async () => {
        jest.isolateModules(() => {
            require('../asana-update-tasks.js');
        });
        // Wait for update tasks to run
        await new Promise((resolve) => setTimeout(resolve, 200));

        expect(mockAsanaClient.tasks.updateTask).toHaveBeenCalledTimes(3);
        expect(mockAsanaClient.tasks.updateTask.mock.calls).toMatchSnapshot();
    });
});

describe('when all data is available', () => {
    it('updates each platforms task notes', async () => {
        jest.isolateModules(() => {
            require('../asana-update-tasks.js');
        });
        // Wait for update tasks to run
        await new Promise((resolve) => setTimeout(resolve, 200));

        expect(mockAsanaClient.tasks.updateTask).toHaveBeenCalledTimes(3);
        expect(mockAsanaClient.tasks.updateTask.mock.calls).toMatchSnapshot();
    });
});
