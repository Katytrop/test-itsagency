import gulpPug from 'gulp-pug';
import { menuItems } from '../../src/js/data/menu.js';
import { headerActions } from '../../src/js/data/actions.js';
import { slides } from '../../src/js/data/mainscreenSlider.js';

export const pug = () => {
    return app.gulp.src(app.path.src.pug, { sourcemaps: app.isDev })
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "PUG",
                message: "Error: <%= error.message %>"
            }))
        )
        .pipe(gulpPug({
            pretty: app.isDev,// форматировать HTML в режиме разработки
            basedir: app.path.src,
            data: {
                menuItems,
                headerActions, 
                slides
            }
        }))
        .pipe(app.gulp.dest(app.path.build.html))
        .pipe(app.plugins.browsersync.stream());
};