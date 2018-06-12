// https://css-tricks.com/gulp-for-beginners/
// https://github.com/zellwk/gulp-starter-csstricks

// Requires these things
var gulp          = require('gulp');
var sass          = require('gulp-sass');
var browserSync   = require('browser-sync').create();
var useref        = require('gulp-useref');
var uglify        = require('gulp-uglify');
var gulpIf        = require('gulp-if');
var cssnano       = require('gulp-cssnano');
var del           = require('del');
var runSequence   = require('run-sequence');
var autoprefixer  = require('gulp-autoprefixer');




// ————————————————————————————————
// Development Tasks
// ————————————————————————————————

//  Start BrowserSync server, reloads browser when definied items change
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})


// SASS to CSS
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') // Get all files ending with .scss in app/scss and children directories
    .pipe(sass().on('error', sass.logError)) // Pass through a gulp-sass, log errors to console
    .pipe(autoprefixer({
      browsers: ['> 5%', 'last 2 versions'],
      cascade: true
    })) // Pass through autoprefixer
    .pipe(gulp.dest('app/css')) // Output the file in the destination folder
    .pipe(browserSync.reload({
      stream: true
    })) // Reload the browser with BrowserSync
})


// Watchers
gulp.task('watchers', function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
})




// ————————————————————————————————
// Optimization Tasks
// ————————————————————————————————

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify())) // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.css', cssnano())) // Minifies only if it's a CSS file
    .pipe(gulp.dest('dist')) // Place in the dist folder
});


// Copying fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})


// Clean the dist folder
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});




// ————————————————————————————————
// Build Sequences
// ————————————————————————————————

// Gulp Watch
gulp.task('watch', function(callback) {
	runSequence(['sass', 'browserSync'],
		'watchers',
		callback
	)
})


// Gulp Build
gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    ['useref', 'fonts'],
    callback
  )
})
