var gulp = require('gulp');
var browserSync = require('browser-sync').create();

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
    //port : 3001
  });

  gulp.watch( gulp.paths.demo + "/*.*").on('change', browserSync.reload);
});


gulp.task('serve' , ['browser-sync']);


