import webpack from "webpack-stream";

export const copyGsap = () => {
    return app.gulp.src('src/js/gsap/**/*') // Путь к папке с GSAP
        .pipe(app.gulp.dest('dist/js/gsap')); // Папка назначения
};

export const js = () => {
    return app.gulp.src(app.path.src.js, {sourcemaps: app.isDev })
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "JS",
                message: "Error: <%= error.message %>"
            })
        ))
        .pipe(webpack({
            mode: app.isBuild ? 'production' : 'development',
            output: {
                filename: 'app.min.js',
            }
        }))
        .pipe(app.gulp.dest(app.path.build.js))
        .pipe(app.plugins.browsersync.stream());
}