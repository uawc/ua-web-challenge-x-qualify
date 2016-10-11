"use strict";

let gulp = require('gulp');
let nodemon = require('gulp-nodemon');

gulp.task('nodemon', () => {
	nodemon({
		script: 'app/app.js',
		watch: ["app/**/*"],
		ext: 'js html css'
	});
});
