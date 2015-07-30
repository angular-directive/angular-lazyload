var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var build = require('gulp-build');
gulp.paths = {
  demo : 'demo'
}

gulp.task('browser-sync', function() {

  browserSync.init({
    server: {
      baseDir : gulp.paths.demo,
      index : 'index.html',
      routes: {
        "/bower_components": "bower_components",
      }
    },
    startPath: '/',
    files : gulp.paths.demo + '/*.*',
    port : 3002
  });

  gulp.watch( gulp.paths.demo + "/*.*").on('change', browserSync.reload);
});


var options = {
  helpers: [{
      name: 'addition',
      fn: function(a, b) { return a + b; }
    }]
};

gulp.task('build' , function(){
   gulp.src(gulp.paths.demo + "/*.js")
      .pipe(build({ GA_ID: '123456' } , options))
      .pipe(gulp.dest('dist'))
})


gulp.task('serve' , ['browser-sync']);


