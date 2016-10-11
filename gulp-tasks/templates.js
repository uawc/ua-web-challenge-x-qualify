"use strict";

let gulp = require('gulp');
let plumber = require('gulp-plumber');

const TEMPLATES_SRC = 'src/templates/**/*.html';

/**
 * Compiles templates.
 */
gulp.task('templates', () => {
	return gulp.src(TEMPLATES_SRC)
		.pipe(gulp.dest('app/public/templates'));
});

gulp.task('templates:watch', () => gulp.watch(TEMPLATES_SRC, ['templates']));
