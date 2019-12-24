/**
 打包同级目录build下的html/css/js 到 同级目录dist下
 npm install gulp -g
 npm install gulp-if -g
 npm install gulp-concat -g
 npm install gulp-htmlmin -g
 npm install gulp-minify-css -g
 npm install gulp-uglify -g
 npm install gulp4-run-sequence -g
 npm install gulp-javascript-obfuscator -g
 npm install minimist -g

 npm link gulp
 npm link gulp-if
 npm link gulp-concat
 npm link gulp-htmlmin
 npm link gulp-minify-css
 npm link gulp-uglify
 npm link gulp4-run-sequence
 npm link gulp-javascript-obfuscator
 npm link minimist

 使用：
    npm run install -verbose
    npm run link

 */


var knownOptions = {
    string: 'env',
    default: { env: process.env.NODE_ENV || 'production' }
};

var minimist = require('minimist');
var options = minimist(process.argv.slice(2), knownOptions);


var gulp = require('gulp');
var gulpif = require('gulp-if');

// html转js
// var ngHtml2Js = require("gulp-ng-html2js");

//删除文件
// var del = require("del");

// 合并文件
// var useref = require('gulp-useref');
var concat = require("gulp-concat");

// 压缩 html css js
// var minifyHtml = require("gulp-minify-html"); // 退休
var htmlmin = require('gulp-htmlmin'); // 推荐
var htmlminConfig = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: true,//压缩HTML
    collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
};

// var minifyCss = require('gulp-minify-css'); // 退休
var cleanCss = require('gulp-clean-css'); // 推荐

var uglify = require("gulp-uglify");

// js混淆
var javascriptObfuscator = require('gulp-javascript-obfuscator');
var obfuscatorConfig = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.7,
    debugProtection: true,
    debugProtectionInterval: false,
    disableConsoleOutput: false,
    domainLock: [],
    identifierNamesGenerator: 'hexadecimal',
    identifiersPrefix: '',
    inputFileName: '',
    log: false,
    renameGlobals: false,
    reservedNames: [],
    reservedStrings: [],
    rotateStringArray: true,
    seed: 2,
    selfDefending: false,
    sourceMap: false,
    sourceMapBaseUrl: '',
    sourceMapFileName: '',
    sourceMapMode: 'separate',
    stringArray: true,
    stringArrayEncoding: 'rc4',
    stringArrayThreshold: 0.75,
    target: 'browser',
    transformObjectKeys: false,
    unicodeEscapeSequence: false,
    rotateStringArrayEnabled: true
}

// 同步执行
// var gulpSequence = require('gulp-sequence').use(gulp);
var runSequence = require('gulp4-run-sequence');

gulp.task('打包html', function () {
    return gulp
        .src([
            "./build/*.html",
        ])
        .pipe(concat("ok.html"))
        .pipe(gulpif(options.env === 'production', htmlmin(htmlminConfig)))
        .pipe(gulp.dest("./dist/"))
        .on('end', function () {
            console.log('[' + new Date().toLocaleTimeString() + ']', [
                '打包html 结束',
            ]);
        });
});

gulp.task('打包css', function () {
    return gulp
        .src([
            './build/*.css',
        ])
        .pipe(concat("css/ok.css"))
        .pipe(gulpif(options.env === 'production', cleanCss()))
        .pipe(gulp.dest('./dist/'))
        .on('end', function () {
            console.log('[' + new Date().toLocaleTimeString() + ']', [
                '打包css 结束',
                '生成 test.css'
            ]);
        });
});

gulp.task('打包js', function () {
    return gulp
        .src([
            './build/*.js',
        ])
        .pipe(concat("js/ok.js"))
        .pipe(gulpif(options.env === 'production', uglify()))
        .pipe(gulpif(options.env === 'production', javascriptObfuscator(obfuscatorConfig)))
        .pipe(gulp.dest('./dist/'))
        .on('end', function () {
            console.log('[' + new Date().toLocaleTimeString() + ']', [
                '打包js 结束',
                '生成 test.js'
            ]);
        });
});

gulp.task('default', function(callback) {
    runSequence(
        '打包html',
        '打包css',
        '打包js',
        function () {
            console.log('[' + new Date().toLocaleTimeString() + ']', "输出完成！");
        },
        callback
    );
});
