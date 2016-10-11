"use strict";

let gulp = require('gulp');
let plumber = require('gulp-plumber');

const SERVER_SRC = 'src/server/**/*';
const DEPS_LIST = [
	'node_modules/@angular/*/bundles/*.js',
	'node_modules/rxjs/**/*.js',
	'node_modules/core-js/client/shim.min.js',
	'node_modules/zone.js/dist/zone.min.js',
	'node_modules/reflect-metadata/Reflect.js',
	'node_modules/systemjs/dist/system.js',
	'node_modules/underscore/underscore-min.js'
];


/**
 * Copies vendors that are being required in runtime.
 */
gulp.task('dependecies', () => {
	return gulp.src(DEPS_LIST, { base: 'node_modules' })
		.pipe(gulp.dest('app/public/lib'));
});


/**
 * Copies all server files to app.
 */
gulp.task('server:copy', () => {
	return gulp.src(SERVER_SRC)
		.pipe(gulp.dest('app'));
});

gulp.task('server:watch', () => gulp.watch(SERVER_SRC, ['server:copy']));
