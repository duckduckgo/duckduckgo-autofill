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
                    'dist/autofill.js': ['src/**/*.js'],
                    'dist/captureDdgGlobals.js': 'src/captureDdgGlobals.js'
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
            copyToXcodeProject: 'cp dist/autofill.js /Users/gsv/Library/Developer/Xcode/DerivedData/DuckDuckGo-haizebgdqbgftvgezodmsliomuvw/SourcePackages/checkouts/BrowserServicesKit/Sources/BrowserServicesKit/Resources/duckduckgo-autofill/dist/'
        },
        /**
         * Run predefined tasks whenever watched files are added,
         * modified or deleted.
         */
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['browserify', 'exec:copyToXcodeProject']
            }
        }
    })

    grunt.registerTask('default', ['eslint', 'browserify'])
    grunt.registerTask('dev', ['eslint', 'browserify', 'watch'])
}
