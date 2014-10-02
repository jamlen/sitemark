var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    watch = require('gulp-watch'),
    // changed = require('gulp-changed'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    colors = require('colors'),
    coveralls = require('gulp-coveralls');

var paths = {
    'src': ['./sitemark.js', './lib/**/*.js', './routes/**/*.js'],
    'tests': ['./test/**/*.js']
};

// An error handler for the tests during gulp-watch
// Otherwise the gulp-watch will terminate
var handleError = function(err) {
    console.log((err.name + ': ' + err.plugin + ' - ' + err.message).red);
    // propogate
    return;
};

// gulp lint
gulp.task('lint', function() {
    gulp.src(paths.src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));

});

// gulp for running the mocha tests with default dot reporter
gulp.task('test', function(cb) {
    gulp.src(paths.src)
        .pipe(istanbul())
        .on('finish', function() {
            gulp.src(paths.tests)
                .pipe(mocha({
                    require: 'should',
                    reporter: 'spec'
                }))
				.pipe(istanbul.writeReports({
					reporters: ['lcov', 'json', 'text', 'text-summary', 'html', 'clover']
				}))
                .on('end', function() {
                    if (process.env.COVERALLS_REPO_TOKEN) {
                        gulp.src('coverage/**/lcov.info')
                            .pipe(coveralls())
                            .on('end', cb);
                    }
                })
                .on('error', handleError);
        });
});


/*
 * auto/watch gulp tasks that will trigger the tests on
 * file changes
 */
gulp.task('watch', function() {
    gulp.watch(paths.src.concat(paths.tests), ['lint', 'test']);
});

gulp.task('default', ['lint', 'test']);
