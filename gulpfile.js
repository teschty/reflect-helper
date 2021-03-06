var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del')
var merge = require("merge2");
var runSequence = require("run-sequence");
var mocha = require("gulp-mocha");
var sourcemaps = require('gulp-sourcemaps');
var typedoc = require("gulp-typedoc");

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('default', function(done) {

    runSequence('build', 'lib', 'test', done);
});

gulp.task('build', ['clean'], function(done) {

    var tsResult = gulp.src(['typings/**/*.ts', 'src/**/*.ts', 'tests/**/*.ts'])
        .pipe(ts(tsProject));

    return merge([
        tsResult.dts.pipe(gulp.dest('build')),
        tsResult.js.pipe(gulp.dest('build'))
    ]);
});

gulp.task('clean', function() {
    return del(['build', 'lib']);
});

gulp.task('lib', function(done) {

    return gulp.src(['build/src/**/*.js', "build/src/**/*.d.ts", "src/**/*.d.ts", "package.json", "*.txt", "README.md", "example.js" ])
        .pipe(gulp.dest('lib'));
});

gulp.task('test', function() {
    return gulp.src('build/tests/**/*.tests.js', {read: false})
        .pipe(mocha());
});

// Performs build with sourcemaps
gulp.task('debug', ['clean'], function() {

    return gulp.src(['typings/**/*.ts', 'src/**/*.ts', 'tests/**/*.ts' ])
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: process.cwd() }))
        .pipe(gulp.dest('build'));
});

gulp.task('docs', function() {
    return gulp.src(['typings/**/*.ts', 'src/**/*.ts']).pipe(typedoc({
        target: 'es5',
        module: "commonjs",
        out: 'build/docs',
        mode: "file",
        name: "reflect-helper",
        entryPoint: "index",
        includeDeclarations: false,
        excludeExternals: true,
        excludeNotExported: true,
        plugin: ['comment']
    }));
});

gulp.task('release-docs', function(done) {

    return gulp.src(['build/docs/**/*.*' ])
        .pipe(gulp.dest('docs'));
});
