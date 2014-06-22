# grunt-md5-plus

>对文件添加md5的时间戳、对应的md5的时间列表

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
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```


### options

    separator: '-', // 连接文件名和md5的分隔符
    md5Length: '6', // 文件内容md5值的长度
    scriptMap: 'tmp/scriptMap.phtml', // 包含 script 的 json map
    mapConfig: 'tmp/mapConfig.json' // 文件名对应的md5的map


