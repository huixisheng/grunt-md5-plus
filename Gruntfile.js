/*
 * grunt-md5-plus
 * https://github.com/huixisheng/grunt-md5-plus
 *
 * Copyright (c) 2014 huixisheng
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    // console.log( pkg );
    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp', 'scriptMap.phtml' , 'mapConfig.json'],
        },


        // Configuration to be run (and then tested).
        md5_plus: {
            defaults_options: {
                files: [{
                    expand: true,
                    cwd: 'test/',
                    dest: 'tmp/defaults/',
                    src: ['dist/**']
                }]
            },
            custom_options: {
                options:{
                    separator: '.',
                    md5Length: '10',
                    phpMap: 'tmp/custom/phpMap.php',
                    scriptMap: 'tmp/custom/scriptMap.phtml',
                    mapConfig: 'tmp/custom/mapConfig.json'
                },

                files: [{
                    expand: true,
                    cwd: 'test/',
                    dest: 'tmp/custom/',
                    src: ['distCustom/**']
                }]
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'md5_plus', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['md5_plus']);

};
