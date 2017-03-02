'use strict';

const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const matchers = {
    js: [
        // 含有引号
        { pattern: /(<script\s[^>]*?src=["'])([\s\S]+?)(["'][^>]*>\s*<\/script>)/gi, fallback: true },
        // 不含有引号
        { pattern: /(<script\s[^>]*?src=)([\s\S]+?)((?:>|\s[^>]*>)\s*<\/script>)/gi, fallback: true },
    ],
    css: [
        // link 
        { pattern: /(<link\s[^>]*?href=["'])([\s\S]+?)(["'][^>]*>(?:\s*<\/link>)?)/gi, fallback: true },
        { pattern: /(<link\s[^>]*?href=)([\s\S]+?)((?:>|\s[^>]*>)(?:\s*<\/link>)?)/gi, fallback: true },
    ],
    img: [
        // img 
        { pattern: /(<img\s[^>]*?src=["'])(.+?)(["'][^>]*>)/gi, fallback: false },
        { pattern: /(<img\s[^>]*?src=)(.+?)((?:>|\s[^>]*>))/gi, fallback: false },
        // CSS的URL属性
        { pattern: /(url\(['"]?)(.+?)(['"]?\))/gi, fallback: false }
    ],
};

const onup = {
    // 上传所有资源
    uploadFiles(files = []) {
        files = files.filter(file => {
            return file;
        })
        if (files.length < 1) {
            return Promise.reject('未找到要上传的文件');
        }
        return files;
        // return qcdn.upload(files);
    },

    // 查找所有资源
    findFiles(contents = '', www_root, file_type) {
        return new Promise((resolve, reject) => {
            let Arr = [],
                matcher = [];
            if (file_type) {
                matcher = matchers[file_type];
            } else {
                matcher = matchers.js.concat(matchers.img, matchers.css);
            }
            matcher.forEach(function(m) {
                contents = contents.replace(m.pattern, function(match, pre, url, post) {
                    // console.log(url);
                    try {
                        url = decodeURIComponent(url);
                    } catch (e) {
                        //Invalid URL ignore
                        return;
                    }
                    if (/(^\.\/)/.test(url)) {
                        // 相对路径
                        url = path.join(dirname, url)
                    } else if (/(^\/)/.test(url)) {
                        // 根目录
                        url = path.join(www_root, url)
                    }
                    Arr.push(url);
                    return pre + url + post;
                });
            })
            resolve({ Arr, contents });
        })
    },

    filterFiles(files = []) {
        return Promise.all(files.map(file => {
            return new Promise((resolve, reject) => {
                fs.access(file, fs.constants.R_OK | fs.constants.W_OK, (err) => {
                    // console.log(err);
                    if (err) {
                        resolve(null);
                    } else {
                        resolve(file);
                    }
                });
            });
        }))
    },
}

exports.uploadCdn = function(file_path, www_root, file_type) {
    fs.readFile(file_path, (err, data) => {
        if (err) throw err;
        let cnts = data.toString();
        let dirname = path.dirname(file_path);
        onup.findFiles(cnts, www_root, file_type).then((result) => {
            // 筛选
            cnts = result.contents;
            return onup.filterFiles(result.Arr);
        }).then((files) => {
            // 上传
            return onup.uploadFiles(files);
        })
        // .then((uploadOjb) => {
        //     // 替换
        //     console.log('上传：', uploadOjb);
        //     for (let key in uploadOjb) {
        //         var reg = new RegExp(key, "g");
        //         cnts = cnts.replace(reg, function(match) {
        //             return uploadOjb[key]
        //         })
        //     }
        //     let new_file = path.join(dirname, ('online.' + path.basename(file_path)));
        //     fs.writeFile(new_file, cnts, (err) => {
        //         if (err) throw err;
        //     });
        // }, (err) => {
        //     if (err) console.log(err);
        // })
    });
}
