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
                        [
                            'babelify', {
                                presets: ['@babel/preset-env'],
                                global: true
                            }
                        ]
                    ]
                },
                files: {
                    'dist/autofill.js': ['src/autofill.js']
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
            copyAssets: 'npm run copy-assets',
            copyHtml: 'cp src/TopAutofill.html dist/TopAutofill.html'
        },
        /**
         * Run predefined tasks whenever watched files are added,
         * modified or deleted.
         */
        watch: {
            scripts: {
                files: ['src/**/*.js', 'packages/password/**/*.{json,js}'],
                tasks: ['browserify', 'exec:copyAssets']
            },
            html: {
                files: ['src/**/*.html'],
                tasks: ['exec:copyHtml']
            },
            styles: {
                files: ['src/**/*.css', 'src/UI/styles/*'],
                tasks: ['exec:copyAssets']
            }
        }
    })

    grunt.registerTask('default', [
        'browserify',
        'exec:copyHtml',
        'exec:copyAssets'
    ])
    grunt.registerTask('dev', ['default', 'watch'])
}
