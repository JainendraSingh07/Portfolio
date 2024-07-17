const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const fs = require('fs');
const path = require('path');

// Dynamically import modules
async function importModules() {
    const rev = (await import('gulp-rev')).default;
    const terser = (await import('gulp-terser')).default;
    const imagemin = (await import('gulp-imagemin')).default;
    const { deleteAsync } = await import('del');
    return { rev, terser, imagemin, deleteAsync };
}

gulp.task('css', async function(done) {
    const { rev } = await importModules();
    console.log('Minifying CSS...');
    const sassDir = './assets/scss';
    if (fs.existsSync(sassDir) && fs.readdirSync(sassDir).length) {
        gulp.src('./assets/scss/**/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(cssnano())
            .pipe(gulp.dest('./public/assets/css'));
    } else {
        console.warn(`Directory ${sassDir} is empty or does not exist.`);
    }

    gulp.src('./assets/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));

    done();
});

gulp.task('js', async function(done) {
    const { rev, terser } = await importModules();
    console.log('Minifying JS...');
    gulp.src('./assets/**/*.js')
        .pipe(terser())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));

    done();
});

gulp.task('image', async function(done) {
    const { rev, imagemin } = await importModules();
    console.log('Compressing images...');
    gulp.src('./assets/image/**/*.+(png|jpg|gif|svg|jpeg)')
        .pipe(imagemin())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets/image')) // Adjust destination if needed
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));

    done();
});

gulp.task('clean:assets', async function(done) {
    const { deleteAsync } = await importModules();
    console.log('Cleaning assets...');
    await deleteAsync(['./public/assets']);
    done();
});

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'image', function(done) {
    console.log('Building assets');
    done();
}));
