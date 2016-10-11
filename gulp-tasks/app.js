"use strict";

let gulp = require('gulp');
let typescript = require('gulp-tsc');
let plumber = require('gulp-plumber');

const APP_SRC = 'src/js/**/*.ts';

/**
 * Compiling typescript files and copying them to app dir.
 */
gulp.task('app', () => {
	let compilerOptions = require('../tsconfig.json').compilerOptions;

	return gulp.src(['typings/index.d.ts', APP_SRC])
		.pipe(plumber())
		.pipe(typescript(compilerOptions))
		.pipe(gulp.dest('app/public/js'));
});

gulp.task('app:watch', () => gulp.watch(APP_SRC, ['app']));
