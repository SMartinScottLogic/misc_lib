var gulp = require('gulp');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var rename = require('gulp-rename');

var babel_options = {
    "presets": ["es2015"],
    "plugins": ["transform-runtime"]
}

gulp.task('tsc', function() {
    var tsProject = ts.createProject('tsconfig.json');
    return tsProject.src()
        .pipe(ts(tsProject))
        .pipe(babel(babel_options))
        .pipe(rename(function(path) {
            path.extname = '.js'
        }))
        .pipe(gulp.dest('./dist'));
})

gulp.task('babel', function() {
    return gulp.src('lib/**/*.js')
        .pipe(babel(babel_options))
        .pipe(rename(function(path){
            path.extname = '.js'
        }))
        .pipe(gulp.dest('./dist'))
})

gulp.task('default', ['tsc', 'babel']);
