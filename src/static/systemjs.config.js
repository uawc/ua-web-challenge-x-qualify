(function (global) {
	var map = {
		'app': './js/src/js',
		'@angular': 'lib/@angular',
		'rxjs': 'lib/rxjs',
		'underscore': 'lib/underscore'
	};

	var packages = {
		'app': {
			main: 'main.js',
			defaultExtension: 'js'
		},
		'rxjs': {
			defaultExtension: 'js'
		},
		'underscore': {
			main: 'underscore-min.js',
			defaultExtension: 'js'
		}
	};

	var ngPackageNames = [
		'common',
		'compiler',
		'core',
		'forms',
		'http',
		'platform-browser',
		'platform-browser-dynamic',
		'router',
		'router-deprecated',
		'upgrade',
	];

	ngPackageNames.forEach(function (pkgName) {
		packages['@angular/' + pkgName] = {
			main: System.packageWithIndex ? 'index.js' : 'bundles/' + pkgName + '.umd.js',
			defaultExtension: 'js'
		};
	});

	System.config({
		map: map,
		packages: packages
	});
})(this);
