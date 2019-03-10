# grunt-md5-plus

>对文件添加md5的时间戳、对应的md5的时间列表。可配合seajs的map使用。

## 如何使用

安装 `grunt-md5-plus`

```shell
npm install grunt-md5-plus --save-dev
```

在`Gruntfile.js` 添加

```js
grunt.loadNpmTasks('grunt-md5-plus');
```


## `grunt-md5-plus` task

```js
grunt.initConfig({
  md5_plus: {
    options: {
        separator: '.',
        md5Length: '10',
        phpMap: 'tmp/custom/phpMap.php',
        scriptMap: 'tmp/custom/scriptMap.phtml',
        mapConfig: 'tmp/custom/mapConfig.json'
    },
    your_target: {
        files: [{
            expand: true,
            cwd: 'test/',
            dest: 'tmp/custom/',
            src: ['distCustom/**']
        }]
    },
  },
});
```


### options

    separator: '-', // 连接文件名和md5的分隔符
    md5Length: '6', // 文件内容md5值的长度
    phpMap: 'tmp/phpMap.php', // 添加php对于的版本号的map
    scriptMap: 'tmp/scriptMap.phtml', // 包含 script 的 json map
    mapConfig: 'tmp/mapConfig.json' // 文件名对应的md5的map。如果md5的value存在将不再拷贝

### 使用说明

配合seajs的map

```
  var map = [];
  $.each(SEAJSMAP, function(key, value){
      var reg = new RegExp(key, 'g');
      var result = key.replace('.js', '-' + value + '.js' );
      map.push( [key, result]);
  });
  seajs.config({
      map: map
  });
```

配合php

```  
  $versionMap = include_once('tmp/phpMap.php');
  <link href="http://huixisheng.com/index-<?php if (isset($versionMap['index.css']))  echo $versionMap['index.css'];?>.css" rel="stylesheet" />
```


