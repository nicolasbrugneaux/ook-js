var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var source = require( 'vinyl-source-stream' );
var watchify = require( 'watchify' );
var browserify = require( 'browserify' );
var babelify = require( 'babelify' );
var assign = require( 'object-assign' );
var jasmine = require( 'gulp-jasmine' );

var bundler = watchify( browserify( './src/js/app.jsx',
    assign( watchify.args, { debug: true } ) ) ); //add inline sourcemap
// add any other browserify options or transforms here
bundler.transform( babelify.configure(
{
    stage: 0
} ) );

gulp.task( 'js', bundle ); // so you can run `gulp js` to build the file
bundler.on( 'update', bundle ); // on any dep update, runs the bundler
bundler.on( 'log', gutil.log ); // output build logs to terminal
gulp.task( 'test', test );

function bundle()
{
    return bundler.bundle()
        // log errors if they happen
        .on( 'error', gutil.log.bind( gutil, 'Browserify Error' ) )
        .pipe( source( 'bundle.js' ) )
        //
        .pipe( gulp.dest( './dist/js/' ) );
}

function test ()
{
    return gulp.src( 'test/ook-test.js' )
        .pipe( jasmine() );
}
