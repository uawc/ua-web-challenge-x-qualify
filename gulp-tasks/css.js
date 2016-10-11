"use strict";

let gulp = require('gulp');
let less = require('gulp-less');
let plumber = require('gulp-plumber');
let path = require('path');

const LESS_SRC_PATH = 'src/css/**/*.less';

/**
 * Compiles each styl file and places it in css dir.
 */
gulp.task('css', () => {
	return gulp.src(LESS_SRC_PATH)
		.pipe(plumber())
		.pipe(less({
			paths: [ path.join(__dirname, 'css', 'includes') ]
		}))
		.pipe(gulp.dest('app/public/css'));
});

gulp.task('css:watch', () => gulp.watch(LESS_SRC_PATH, ['css']));

