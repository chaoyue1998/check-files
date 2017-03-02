# check-files
查找静态资源路径，支持css、js、图片。
建议先替换css中图片。
## Quick Start

### Install

```sh
$ npm install -g check-files
```

### Start

```sh
$ check-files -f index.html
```

```sh
$ check-files -f index.html -r /root
```

## Options

| Option | Alias | Default | Description |
| :------------------ | :-: | :--------: | :-------- |
| --file              | -f  | index.html | 上传的文件名 |
| --root              | -r  | 当前路径   | 静态文件的相对根路径 |
| --type              | -t  | 所有类型   | 静态文件的类型，可选值:js css img  |
