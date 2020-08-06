import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import scss from 'rollup-plugin-scss'
import copyAssets from 'rollup-plugin-copy-imported-assets';

const env = process.env.NODE_ENV

const config = {
  input: 'src/index.js',
  external: Object.keys(pkg.peerDependencies || {}),
  output: {
    format: 'esm',
    name: 'main',
    globals: {
      react: 'React',
      redux: 'Redux',
      'react-dom': 'ReactDOM',
      antd: 'antd',
      immer: 'immer',
      ajv: 'ajv',
      lodash: 'lodash',
    }
  },
  plugins: [
    nodeResolve(),
    babel({
      exclude: '**/node_modules/**',
      runtimeHelpers: true
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    
    scss(),
    
    commonjs({
      namedExports: {
        'node_modules/react-js/index.js': ['isValidElementType'],
      },
      include: [
        /node_modules\/prop-types/,
        /node_modules\/hoist-non-react-statics/,
        /node_modules\/invariant/,
        /node_modules\/react-is/,
        /node_modules\/warning/,
        /node_modules\/moment/,
      ],
    }),
  ]
}

if (env === 'production') {
  config.plugins.push(
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
}

export default config