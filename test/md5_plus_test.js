'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.md5_plus = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  defaults_options: function(test) {
    test.expect(7);

    var createMapConfig = 'tmp/mapConfig.json';
    var createScriptMap = 'tmp/scriptMap.phtml';
    var expectedMapConfig = 'test/expected/defaults/mapConfig.json';
    var expectedScript = 'test/expected/defaults/scriptMap.phtml';

    // map文件是否生成
    test.ok( grunt.file.exists( createMapConfig ), 'mapConfig.json created');
    test.ok( grunt.file.exists( createScriptMap ), 'scriptMap.phtml created');

    // 生成的map文件内容是否正确
    var actual = grunt.file.read( createMapConfig );
    var expected = grunt.file.read( expectedMapConfig );
    test.equal(actual, expected, 'mapConfig.json create right.');

    var actualScriptMap = JSON.stringify(grunt.file.read( createScriptMap ));
    var expectedScriptMap = JSON.stringify(grunt.file.read( expectedScript ));
    test.equal(actualScriptMap, expectedScriptMap, 'scriptMap.phtml pass.');

    // 对应文件添加时间戳是否生成成功
    var filelist = grunt.file.readJSON( expectedMapConfig );
    for(var file in filelist){
      var filename = 'tmp/defaults/' + file.replace('.js', '-' + filelist[file] + '.js');
      test.ok( grunt.file.exists(filename), filename + ' created');
    }
    test.done();
  },
  custom_options: function(test) {
    test.expect(7);

    var createMapConfig = 'tmp/custom/mapConfig.json';
    var createScriptMap = 'tmp/custom/scriptMap.phtml';
    var expectedMapConfig = 'test/expected/custom/mapConfig.json';
    var expectedScript = 'test/expected/custom/scriptMap.phtml';

    // map文件是否生成
    test.ok( grunt.file.exists( createMapConfig ), 'mapConfig.json created');
    test.ok( grunt.file.exists( createScriptMap ), 'scriptMap.phtml created');

    // 生成的map文件内容是否正确
    var actual = grunt.file.read( createMapConfig );
    var expected = grunt.file.read( expectedMapConfig );
    test.equal(actual, expected, 'mapConfig.json create right.');

    var actualScriptMap = JSON.stringify(grunt.file.read( createScriptMap ));
    var expectedScriptMap = JSON.stringify(grunt.file.read( expectedScript ));
    test.equal(actualScriptMap, expectedScriptMap, 'scriptMap.phtml pass.');

    // 对应文件添加时间戳是否生成成功
    var filelist = grunt.file.readJSON( expectedMapConfig );
    for(var file in filelist){
      var filename = 'tmp/custom/' + file.replace('.js', '.' + filelist[file] + '.js');
      test.ok( grunt.file.exists(filename), filename + ' created');
    }
    test.done();
  },
};
