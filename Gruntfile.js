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
                    'dist/autofill.js': ['src/**/*.js']
                }
            }
        },
        eslint: {
            options: {
                configFile: '.eslintrc',
                useEslintrc: false // avoid conflicts with parent repo
            },
            target: 'src/**/*.js'
        },
        exec: {
            excludeBuild: 'git update-index --assume-unchanged dist/autofill.js'
        },
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

    grunt.registerTask('default', ['exec:excludeBuild', 'browserify', 'eslint'])
    grunt.registerTask('dev', ['exec:excludeBuild', 'browserify', 'eslint', 'watch'])
}
