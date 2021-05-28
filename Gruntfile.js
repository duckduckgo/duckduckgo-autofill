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
        exec: {},
        /**
         * Run predefined tasks whenever watched files are added,
         * modified or deleted.
         */
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['browserify']
            }
        }
    })

    grunt.registerTask('default', ['eslint', 'browserify'])
    grunt.registerTask('dev', ['eslint', 'browserify', 'watch'])
}
