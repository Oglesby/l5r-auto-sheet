var gulp = require('gulp');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var debug = require('gulp-debug');
var karma = require('karma').server;
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var stylish = require('jshint-stylish');

// Default task
gulp.task('default', ['serve', 'watch']);

// Developer tasks
gulp.task('serve', ['less', 'lint', 'browserify', 'test', 'connect']);

gulp.task('watch', function() {
    gulp.watch(['./app/*.js', './app/**/*.js', './app/*.html', './app/**/*.html', './assets/styles/**/*.less'], ['re-serve']);
});

gulp.task('lint', function() {
    return gulp.src(['./app/**/*.js', '!./app/bower_components/**', '!./app/bundle.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
});

gulp.task('less', function() {
    return gulp.src(['./assets/styles/*.less', './assets/styles/**/*.less'])
        .pipe(less({
            paths: ['.']
        }))
        .pipe(gulp.dest('assets/css/'))
})

gulp.task('test', function (done) {
    // NOOP for now until we get tests that work.
    //karma.start({
    //    configFile: __dirname + '/karma.conf.js',
    //    singleRun: true
    //}, done);
});

gulp.task('re-serve', ['less', 'lint', 'browserify', 'test', 'reload']);

// Connection tasks
gulp.task('connect', function() {
    return connect.server({
        root: ['app', 'assets'],
        livereload: true,
        port: 9000
    });
});

gulp.task('connect-dist', function() {
    return connect.server({
        root: 'dist',
        port: 9001
    });
});

gulp.task('reload', function() {
    return gulp.src('./app/*.html')
        .pipe(connect.reload());
});


// Basic tasks
gulp.task('clean', function() {
    return gulp.src('./app/bundle.js')
        .pipe(clean({force: true}));
});

gulp.task('clean-dist', ['clean'], function() {
    return gulp.src('./dist/*')
        .pipe(clean({force: true}));
});



// Distribution tasks
gulp.task('build',
    ['less', 'lint', 'minify-css', 'minify-js', 'copy-assets', 'copy-html-files', 'copy-bower-components', 'connect-dist']
);

gulp.task('minify-css', function() {
    var opts = {comments:true,spare:true};
    return gulp.src(['./assets/**/*.css', '!./app/bower_components/**'])
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest('dist/'))
});

gulp.task('minify-js', function() {
    return gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
        .pipe(uglify({
            // inSourceMap:
            // outSourceMap: "app.js.map"
        }))
        .pipe(gulp.dest('dist/'))
});

gulp.task('copy-bower-components', function() {
    return gulp.src('./app/bower_components/**')
        .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('copy-html-files', function() {
    return gulp.src('./app/**/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-js', function() {
    return gulp.src(['./app/bundle.js', '!./app/bower_components/**'])
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-css', function() {
    return gulp.src(['./assets/**/*.css', '!./app/bower_components/**'])
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-assets', function() {
    // Don't copy the styles, they're migrated on their own.
    return gulp.src(['./assets/**/*.*', '!./assets/styles/*'])
        .pipe(gulp.dest('dist/'));
});

// Browserify task
gulp.task('browserify', function() {
    // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
    return gulp.src(['app/app.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('app/'))
});
