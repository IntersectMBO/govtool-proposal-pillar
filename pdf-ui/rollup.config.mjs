import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';

export default [
    {
        input: './src/App.jsx',
        output: [
            {
                file: 'dist/app.cjs.js',
                format: 'cjs',
                sourcemap: true,
                banner: "'use client';",
            },
        ],
        onwarn(warning, warn) {
            if (
                warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
                warning.message.includes('use client')
            ) {
                return;
            }
            warn(warning);
        },
        plugins: [
            external(),
            resolve({ extensions: ['.js', '.jsx'], browser: true }),
            babel({
                extensions: ['.js', '.jsx'],
                include: [
                    'src/**',
                    // Include it in the bundle to avoid issues with the usage of jsx in js
                    'node_modules/@intersect.mbo/intersectmbo.org-icons-set/**',
                ],
                babelHelpers: 'bundled',
                // Add runtime: 'automatic' to enable the new JSX transform
                presets: [
                    '@babel/preset-env',
                    ['@babel/preset-react', { runtime: 'automatic' }],
                ],
            }),
            commonjs({
                include: 'node_modules/**',
                exclude: ['node_modules/@babel/runtime/**'],
            }),
            postcss({ extract: true, inject: true }),
            json(),
            terser({
                compress: {
                    // Keep the client boundary added to the bundled entry point.
                    directives: false,
                },
            }),
        ],
    },
];
