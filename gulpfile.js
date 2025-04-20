'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS  = require('gulp-clean-css');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
require('gulp-watch');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();


gulp.task('reload', (done) => {
    browserSync.reload();
    done();
});

//sassコンパイル
gulp.task('sass', () => {
    return gulp.src('app/style/make_typo.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(rename({extname: '.min.css'}))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('app/style'))
        .pipe(browserSync.stream());
});

gulp.task('browser-sync', () => {
    browserSync.init({
        proxy: 'http://localhost/make_typo',
        port: 3010,
    });
});

//ファイル監視
gulp.task('watch', () => {
    gulp.watch('app/style/make_typo.scss', gulp.task('sass'));
    gulp.watch('app/index.html', gulp.task('reload'));
});


gulp.task('deploy', gulp.series(gulp.parallel('sass')));

//デフォルト
gulp.task('default', gulp.series('deploy', gulp.parallel('browser-sync','watch')));