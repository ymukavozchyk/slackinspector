'use strict';

var nodemon;
var browserSync;
var jshint;

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var cssmin = require('gulp-cssmin');
var htmlreplace = require('gulp-html-replace');

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

gulp.task('production', ['bundle'], function () {
    return gulp.src('public/index.html')
        .pipe(htmlreplace({
            'css': 'assets/styles/css/bundle.css',
            'js': 'assets/js/bundle.js'
        }))
        .pipe(gulp.dest('public'));
});

gulp.task('bundle', ['bundle-js', 'bundle-css'], function () {
    return gulp.src([
        'public/assets/js/build',
        'public/assets/styles/css/build'
    ], { read: false })
        .pipe(clean());
});

gulp.task('bundle-css', ['sass'], function () {
    return gulp.src([
        'public/assets/vendors/angular-material/angular-material.css',
        'public/assets/styles/css/build/main.css'
    ])
        .pipe(cssmin())
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('public/assets/styles/css'));
});

gulp.task('sass', function () {
    return gulp.src('public/assets/styles/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/assets/styles/css/build'));
});

gulp.task('bundle-js', ['bundle-js-modules', 'bundle-js-logic', 'bundle-js-vendors'], function () {
    return gulp.src([
        'public/assets/js/build/vendors.js',
        'public/assets/js/build/modules.js',
        'public/assets/js/build/logic.js'
    ])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('public/assets/js'));
});

gulp.task('bundle-js-vendors', function () {
    return gulp.src([
        'public/assets/vendors/angular/angular.min.js',
        'public/assets/vendors/angular-animate/angular-animate.min.js',
        'public/assets/vendors/angular-sanitize/angular-sanitize.min.js',
        'public/assets/vendors/angular-aria/angular-aria.min.js',
        'public/assets/vendors/angular-messages/angular-messages.min.js',
        'public/assets/vendors/angular-material/angular-material.min.js',
        'public/assets/vendors/angular-ui-router/release/angular-ui-router.min.js'
    ])
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest('public/assets/js/build'));
});

gulp.task('bundle-js-logic', function () {
    return gulp.src(['public/app/**/*.js', '!public/app/**/*.module.js'])
        .pipe(concat('logic.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/assets/js/build'));
});

gulp.task('bundle-js-modules', function () {
    return gulp.src('public/app/**/*.module.js')
        .pipe(concat('modules.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/assets/js/build'));
});

gulp.task('lint', function () {
    jshint = require('gulp-jshint');
    return gulp.src(['server.js', 'public/app/**/*.js', 'backend/**/*.js', 'gulpfile.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});