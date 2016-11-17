'user strict';

var nodemon;
var browserSync;
var jshint;

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', ['browser-sync'], function () {
    gulp.watch('public/assets/styles/scss/**/*.scss', ['sass']);
});

gulp.task('browser-sync', ['nodemon'], function () {
    return browserSync.init(null, {
        proxy: 'localhost:9000',
        files: ['public/**/*.*']
    });
});

gulp.task('nodemon', ['sass-dev'], function () {
    nodemon = require('gulp-nodemon');
    return nodemon({
        script: 'server.js',
        ignore: ['public/', 'node_modules/']
    });
});

gulp.task('sass-dev', function () {
    browserSync = require('browser-sync');
    return gulp.src('public/assets/styles/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/assets/styles/css/build'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('sass', function () {
    return gulp.src('public/assets/styles/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/assets/styles/css/build'));
});

gulp.task('lint', function () {
    jshint = require('gulp-jshint');
    return gulp.src(['public/app/**/*.js', 'backend/**/*.js', 'gulpfile.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});