import ts from 'rollup-plugin-typescript2';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import path from 'path'

export default {
    input: 'src/index.ts',
    output: {
        file: path.resolve(__dirname,'dist/bundle.js'),
        format: 'iife',
        sourcemap: true
    },
    plugins: [
        nodeResolve({ // 先解析第三方插件 默认先解析.js文件，如果找不到在解析.ts文件
            extensions: ['.js','.ts']
        }),
        ts({
            tsconfig: path.resolve(__dirname,'tsconfig.json')
        }),
        serve({
            port: 3000,
            contentBase:'',
            openPage: '/public/index.html'
        })
    ]
}