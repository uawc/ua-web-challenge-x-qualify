"use strict";

let gulp = require('gulp');
let plumber = require('gulp-plumber');

const STATIC_SRC = 'src/static/**/*';

/**
 * Copies all static files to app.
 */
gulp.task('static', () => {
	return gulp.src(STATIC_SRC)
		.pipe(gulp.dest('app/public'));
});

gulp.task('static:watch', () => gulp.watch(STATIC_SRC, ['static']));
