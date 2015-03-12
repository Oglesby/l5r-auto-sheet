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

// Default task
gulp.task('default', ['serve']);

// Developer tasks
gulp.task('watch', ['serve'], function() {
    // TODO: Fix this somehow.
    //gulp.watch(['app/*.js', 'app/**/*.js', 'assets/**/*.less'], function() {
    //    connect.reload();
    //});
});

gulp.task('serve', ['less', 'lint', 'browserify', 'test', 'connect']);

gulp.task('lint', function() {
    gulp.src(['./app/**/*.js', '!./app/bower_components/**', '!./app/bundle.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('less', function() {
    gulp.src(['./assets/styles/*.less', './assets/styles/**/*.less'])
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


// Connection tasks
gulp.task('connect', function() {
    connect.server({
        root: ['app', 'assets'],
        port: 9000
    });
});

gulp.task('connect-dist', function() {
    connect.server({
        root: 'dist',
        port: 9001
    });
});

// Basic tasks
gulp.task('clean', function() {
    gulp.src('./app/bundle.js')
        .pipe(clean({force: true}));
});

gulp.task('clean-dist', ['clean'], function() {
    gulp.src('./dist/*')
        .pipe(clean({force: true}));
});

// Distribution tasks
gulp.task('build',
    ['less', 'lint', 'minify-css', 'minify-js', 'copy-assets', 'copy-html-files', 'copy-bower-components', 'connect-dist']
);

gulp.task('minify-css', function() {
    var opts = {comments:true,spare:true};
    gulp.src(['./assets/**/*.css', '!./app/bower_components/**'])
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest('dist/'))
});

gulp.task('minify-js', function() {
    gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
        .pipe(uglify({
            // inSourceMap:
            // outSourceMap: "app.js.map"
        }))
        .pipe(gulp.dest('dist/'))
});

gulp.task('copy-bower-components', function() {
    gulp.src('./app/bower_components/**')
        .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('copy-html-files', function() {
    gulp.src('./app/**/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-js', function() {
    gulp.src(['./app/bundle.js', '!./app/bower_components/**'])
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-css', function() {
    gulp.src(['./assets/**/*.css', '!./app/bower_components/**'])
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy-assets', function() {
    // Don't copy the styles, they're migrated on their own.
    gulp.src(['./assets/**/*.*', '!./assets/styles/*'])
        .pipe(gulp.dest('dist/'));
});

// Browserify task
gulp.task('browserify', function() {
    // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
    gulp.src(['app/app.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('app/'))
});

//gulp.task('watch', ['lint'], function() {
//    // Watch our scripts
//    gulp.watch(['app/*.js', 'app/**/*.js'],[
//        'lint',
//        'browserify'
//    ]);
//});

