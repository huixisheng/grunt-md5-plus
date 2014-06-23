/*
 * grunt-md5-plus
 * https://github.com/huixisheng/grunt-md5-plus
 * 
 * Copyright (c) 2014 huixisheng
 * Licensed under the MIT license.
 */

'use strict';


var crypto = require('crypto');
var path = require('path');

var md5 = function(source, encoding) {

    var md5sum = crypto.createHash('md5');

    md5sum.update(source, encoding);

    return md5sum.digest('hex');
};



module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('md5_plus', 'md5', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            separator: '-', // 连接文件名和md5的分隔符
            md5Length: '6', // 文件内容md5值的长度
            scriptMap: 'tmp/scriptMap.phtml', // 包含 script 的 json map
            mapConfig: 'tmp/mapConfig.json' // 文件名对应的md5的map
        });

        var mapConfig = {};
        if( grunt.file.exists(options.mapConfig) ){
          mapConfig = grunt.file.readJSON( options.mapConfig );
        }

        // Iterate over all specified file groups.

        this.files.forEach(function(f) {
            var cwd = f.orig.cwd;
            f.src.forEach(function(src) {
                if (grunt.file.isFile(src) ) {
                    var source = grunt.file.read(src);
                    var md5Value = md5(source, 'utf8').substr(0, options.md5Length );
                    var dirname = path.dirname(src);
                    var ext = path.extname(src);
                    var basename = path.basename(src, ext);
                    var newFile =  basename + (md5Value ? options.hashSeparator + md5Value : '') + ext;
                    var mapKey = src.replace(cwd, '').replace('dist/', '');

                    newFile = mapKey.replace(ext, options.separator + md5Value  + ext );

                    var outputPath = path.join(f.orig.dest, newFile);
                    
                    if( !mapConfig[mapKey] || mapConfig[mapKey] != md5Value ){

                      mapConfig[mapKey] = md5Value;
                      grunt.file.copy(src, outputPath);
                    }
                }
            });
        });

        var output = JSON.stringify(mapConfig, null, "  ");
        var seajsMap = mapConfig;
        for(var i in seajsMap){
            if( i.indexOf('-debug.js') >= 0 ){
                delete seajsMap[i];
            }
        }
        var seajsMapString = JSON.stringify(seajsMap).replace('\n', '').replace('\t', '');
        var outputScript = '<script>\nvar SEAJSMAP='+ seajsMapString +';\n</script>';
        grunt.file.write(options.mapConfig, output);
        grunt.log.writeln('mapConfig.json create');
        grunt.file.write(options.scriptMap, outputScript);
        grunt.log.writeln( options.scriptMap + ' create');
    });

};
