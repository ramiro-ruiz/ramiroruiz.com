'use strict';

/*
* Require the path module
*/
const path = require('path');

/*
 * Require the Fractal module
 */
const fractal = module.exports = require('@frctl/fractal').create();

/*
 * Give your project a title.
 */
fractal.set('project.title', 'Design patterns');

/*
 * Tell Fractal where to look for components.
 */
fractal.components.set('path', path.join(__dirname, 'components'));

/*
 * Tell Fractal where to look for documentation pages.
 */
fractal.docs.set('path', path.join(__dirname, 'docs'));

/*
 * Tell the Fractal web preview plugin where to look for static assets.
 */
fractal.web.set('static.path', path.join(__dirname, 'public'));


const mandelbrot = require('@frctl/mandelbrot');

const myCustomisedTheme = mandelbrot({
    skin: "black",
    nav: ['search', 'docs', 'components', 'information'],
    information: [
            {
                label: 'Version',
                value: require('./package.json').version,
            },
            {
                label: 'Built on',
                value: new Date(),
                type: 'time',
                format: (value) => {
                    return value.toLocaleDateString('en');
                },
            },
        ],
});

fractal.web.theme(myCustomisedTheme);
