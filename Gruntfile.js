module.exports = function (grunt) {
    'use strict'

    grunt.loadNpmTasks('grunt-exec')
    grunt.loadNpmTasks('grunt-eslint')
    grunt.loadNpmTasks('grunt-browserify')
    grunt.loadNpmTasks('grunt-contrib-watch')

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                options: {
                    transform: [
                        ['babelify', { presets: ['@babel/preset-env'] }]
                    ]
                },
                files: {
                    'dist/autofill.js': ['src/autofill.js'],
                    'dist/topAutofill.js': ['src/topAutofill.js']
                }
            }
        },
        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            target: 'src/**/*.js'
        },
        exec: {
            copyAutofillStylesToCSS: 'cp src/UI/styles/autofill-tooltip-styles.js dist/autofill.css && sed -i "" \'/`/d\' dist/autofill.css',
            copyHostStyles: 'cp src/UI/styles/autofill-host-styles.css dist/autofill-host-styles_chrome.css && cp src/UI/styles/autofill-host-styles.css dist/autofill-host-styles_firefox.css',
            copyHtml: 'cp src/TopAutofill.html dist/TopAutofill.html',
            // Firefox and Chrome treat relative url differently in injected scripts. This fixes it.
            updateFirefoxRelativeUrl: `sed -i "" "s/chrome-extension:\\/\\/__MSG_@@extension_id__\\/public/../g" dist/autofill-host-styles_firefox.css`
        },
        /**
         * Run predefined tasks whenever watched files are added,
         * modified or deleted.
         */
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['browserify']
            },
            html: {
                files: ['src/**/*.html'],
                tasks: ['exec:copyHtml']
            },
            styles: {
                files: ['src/**/*.css', 'src/UI/styles/*'],
                tasks: ['exec:copyAutofillStylesToCSS', 'exec:copyHostStyles', 'exec:updateFirefoxRelativeUrl']
            }
        }
    })

    grunt.registerTask('default', [
        'eslint',
        'browserify',
        'exec:copyHtml',
        'exec:copyAutofillStylesToCSS',
        'exec:copyHostStyles',
        'exec:updateFirefoxRelativeUrl'
    ])
    grunt.registerTask('dev', ['default', 'watch'])
}
