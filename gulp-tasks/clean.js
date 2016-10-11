"use strict";

let gulp = require('gulp');
let del = require('del');

gulp.task('clean', () => {
	return del(['app']);
});
