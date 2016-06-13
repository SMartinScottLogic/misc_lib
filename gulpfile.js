var gulp = require('gulp');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var typedoc = require("gulp-typedoc");

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

gulp.task("typedoc", function() {
    return gulp
        .src(["lib/**/*.ts","!lib/**/*.spec.ts"])
        .pipe(typedoc({
            module: "commonjs",
            target: "es6",
            out: "docs/",
            name: "Miscellaneous helper functionality",
            verbose: true,
            includeDeclarations: true
        }))
    ;
});

gulp.task('default', ['tsc', 'babel', 'typedoc']);
