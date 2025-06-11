import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
const sass = gulpSass(dartSass);
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import uglify from 'gulp-uglify';
import webp from 'gulp-webp';
import clean from 'gulp-clean';

// Tâche pour copier les polices OTF dans le dossier dist/fonts
function fonts() {
  return gulp.src('src/fonts/**/*.{otf,woff,woff2}') // Sélectionne tous les fichiers de fonts
    .pipe(gulp.dest('dist/fonts')); // Les copie dans le dossier de destination
}

// Tâche pour nettoyer le dossier de destination
function cleanDist() {
  return gulp.src('dist/css', { read: false, allowEmpty: true })
    .pipe(clean());
}

export { cleanDist };

function images() {
  return gulp.src('./src/img/**/*.svg')
    .pipe(gulp.dest('./dist/img'))
}

function imagesGIF() {
  return gulp.src('./src/img/**/*.gif', { since: gulp.lastRun(imagesGIF) }) // Évite de retraiter les fichiers déjà copiés
    .pipe(gulp.dest('./dist/img'))
    .on('end', () => console.log('GIF copiés sans altération !'));
}

// Tâche pour compiler Sass en CSS, ajouter les préfixes et minifier
function compileSass() {
  return gulp.src('src/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'));
}


// Tâche pour remplacer du texte dans les fichiers HTML
function replaceText() {
  return gulp.src('src/*.html')
    .pipe(replace(/\.css/g, '.min.css'))
    .pipe(replace(/\.(jpg|png)/g, '.webp'))
    .pipe(replace(/\.js/g, '.min.js'))
    .pipe(gulp.dest('dist/'));
}

// Tâche pour minifier les fichiers JavaScript
function minifyJS() {
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'));
}

// Tâche pour convertir les images JPG en WebP
function convertToWebp() {
  return gulp.src('src/img/**/*.{jpg,jpeg,png}', {encoding: false})
    .pipe(webp())
    .pipe(rename({ extname: '.webp' }))
    .pipe(gulp.dest('dist/img'));
}


// Tâche de surveillance des fichiers Sass
function watchFiles() {
  gulp.watch('src/scss/**/*.scss', compileSass);
}

// Tâche par défaut (exécutée en tapant simplement 'gulp' dans le terminal)
export default gulp.series(
    fonts,
    images,
    imagesGIF,
    compileSass,
    replaceText,
    minifyJS,
    convertToWebp,
    watchFiles,
  );
