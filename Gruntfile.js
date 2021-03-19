module.exports = function (grunt) {
    'use strict'

    // grunt.loadNpmTasks('grunt-exec')
    grunt.loadNpmTasks('grunt-eslint')
    // grunt.loadNpmTasks('grunt-githooks')
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
        githooks: {
            all: {
                // Will create `./git/hooks/pre-commit`. It will build and commit the output file.
                'pre-push': 'npm run build && git add -f dist/autofill.js && git commit -m "Add build file" && grunt exec:excludeBuild'
            }
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

    grunt.registerTask('default', ['eslint', 'browserify'])
    grunt.registerTask('dev', ['eslint', 'browserify', 'watch'])
}
