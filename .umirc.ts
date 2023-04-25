/*
 * @Author: Peng Xiang (Email:px.i@foxmail.com QQ:245803627)
 * @Date: 2023-02-21 13:41:01
 * @LastEditTime: 2023-04-18 14:05:07
 * @LastEditors: Peng Xiang
 * @Description: 
 * @FilePath: \.umirc.ts
 * 
 */
import { defineConfig } from "umi";
import moment from 'moment';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';


export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
  ],
  npmClient: 'yarn',

  outputPath: 'build',
  // clickToComponent: {},
  mpa: {
    template: 'templates/default.html',
    // getConfigFromEntryFile: false,
    // layout: '@/layouts/basic',
    // entry: {
    //   index: { description: '首页导航' },
    //   foo: { description: 'hello foo' },
    //   bar: { description: 'hello bar' },
    // },
  },
  base: './',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  manifest: {
    basePath: './', // basePath: process.env.NODE_ENV === 'production' ? '/admin/' : '/',
  },

  // dynamicImport: {
  //   loading: '@/Loading',
  // },

  // devServer: {
  //   port: 3000,
  //   compress: false, //开启会导致 模型的加载进度里的总进度一直是0
  //   // https: true,
  // },

  //设置代码中的可用变量。属性值会经过一次 JSON.stringify 转换。
  define: {
    Version: moment().format('YYYYMMDDHHmmss'),
  },
  alias: {
    '@packages': '/src/packages', //@components
    // '@cyczdchartsPublic': process.env.NODE_ENV === 'production' ? './' : '/cyczdcharts/',
  },

  deadCode: {}, //检测未使用的文件和导出，仅在 build 阶段开启。 https://umijs.org/docs/api/config#copy

  //配置方法参考 https://juejin.cn/post/7077176821099266061
  https: {
    "key": path.join(__dirname, 'cert.key'),
    "cert": path.join(__dirname, 'cert.crt')
  },

  // 启用 importmap
  // importMap: true,

  // proxy: {
  //   '/api': {
  //     'target': 'http://jsonplaceholder.typicode.com/',
  //     'changeOrigin': true,
  //     'pathRewrite': { '^/api' : '' },
  //   }
  // },

  // svgr:{}, svgr 默认开启，支持如下方式使用 React svg 组件：import SmileUrl, { ReactComponent as SvgSmile } from './smile.svg';

  // 兼容 ie11
  // targets: {
  //   ie: 11
  // },

  chainWebpack(config, { webpack }) {
    // 设置 alias
    // config.resolve.alias.set('a', 'path/to/a');

    // 删除进度条插件
    // config.plugins.delete('progress');

    // const globalPath = path.join(__dirname, 'src/global.ts')
    // config.entry('umi').prepend(globalPath)

    // config.optimization.minimize(false); //选项表示关闭代码压缩。
    // config.devServer.set('compress', false);

    // config.optimization.minimizer('terser').use(TerserPlugin, [{
    //   terserOptions: {
    //     //@ts-ignore
    //     compress: false,
    //   },
    // }]);


    config.module
      .rule('glb')
      .test(/\.glb$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'glb/[name].[hash:8].[ext]',
      });


    // config.module
    //   .rule('glb')
    //   .test(/\.(glb|gltf)$/)
    //   .use('file-loader')
    //   .loader(require.resolve('file-loader'))
    //   .options({
    //     // name: 'static/[name].[hash:8].[hvm]',
    //     name: '[name].[ext]',
    //     esModule: false,
    //     // limit: 8192*10*10,
    //   })
    //   .end();

    // const GLB_REG = /\.(glb|gltf)$/
    // config.module.rule('asset').exclude.add(GLB_REG).end();
    // config.module
    //   .rule('glb')
    //   .test(GLB_REG)
    //   .exclude.add(/node_modules/)
    //   .end()
    //   .use('file-loader')
    //   .loader(require.resolve('file-loader'))
    //   .end();

  },

  metas: [
    // { name: 'keywords', content: 'umi, umijs' },
    // { name: 'description', content: 'React framework.' },
    // { charset: 'utf-8' },
    // { name: 'generator', content: 'jingge' },
    // { name: 'viewport', content: 'width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0' },
  ],

  //配置 react 组件树渲染到 HTML 中的元素 id。
  // mountElementId: 'container',

  hash: true,

  // exportStatic: {},

  // esbuildMinifyIIFE: true,

  // jsMinifier: 'none',

  // jsMinifier: 'esbuild',
  // jsMinifierOptions: {
  //   minifyWhitespace: true,
  //   minifyIdentifiers: true,
  //   minifySyntax: true,
  // }

  jsMinifier: 'terser',
  jsMinifierOptions: {
    // terser options

    // https://github.com/terser/terser#minify-options
    // ecma: undefined, //可选的，指定要使用的 ECMAScript 版本。默认值为 undefined。
    // parse: {}, // 可选的，指定要使用的解析器选项。默认值为 {}。
    // compress: {}, //可选的，指定要使用的压缩选项。默认值为 {}。
    // mangle: true, // Note `mangle.properties` is `false` by default.
    // module: false,
    // // Deprecated
    // output: null,
    // output: {
    //   comments: false //去除文件头部注释
    // },
    // format: null,
    // toplevel: false,
    // nameCache: null,
    // ie8: false,
    // keep_classnames: undefined,  //(默认: undefined) - 通过true以防止丢弃或修改类名。传递正则表达式以仅保留与该正则表达式匹配的类名。
    // keep_fnames: false,

    //这个开启false后，打包后在移动端会出现模型加载不出来的问题
    keep_fnames: true, //默认: false) - 通过true以防止丢弃或修改函数名称。传递正则表达式以仅保留与该正则表达式匹配的函数名称。对于依赖于Function.prototype.name. 如果顶级 minify 选项 keep_classnames是undefined，它将被顶级 minify 选项的值覆盖keep_fnames。
    // safari10: false,

    compress: {
      // defaults: false,
      // drop_console: true, //去除console
      keep_infinity: true, //(默认: false) -- 传递true以防止Infinity被压缩成1/0，这可能会导致 Chrome 上的性能问题。
      // pure_funcs: [ 'Math.floor' ]
      // hoist_funs: true, //(默认: false) -- 提升函数声明
      // dead_code: true, //(默认: true) -- 删除无法访问的代码
      // directives: true, //(默认: true) -- 删除多余的或非标准的指令
      // hoist_props:false, //默认值：true）——将常量对象和数组文字中的属性提升到受一组约束约束的常规变量中。例如： var o={p:1, q:2}; f(o.p, o.q);转换为f(1, 2);. 注：hoist_props 在最佳状态下mangle启用，compress选项passes设置为2或更高，compress选择toplevel启用。

      // drop_console: true, // 删除所有调式带有console的
      pure_funcs: ["console.log", "useWhyDidYouUpdate"], // 删除console.log
    }
  }


  // chainWebpack(config) {
  //   // config.entry('index').add('@/pages/index.js').end();
  //   config.entry('webxr').add('@/pages/hello-webxr/index.tsx').end();
  //   // config.plugin('html-index').use(require('html-webpack-plugin'), [
  //   //   {
  //   //     filename: 'index.html',
  //   //     template: 'src/pages/index.html',
  //   //     chunks: ['index'],
  //   //   },
  //   // ]);
  //   config.plugin('html-webxr').use(require('html-webpack-plugin'), [
  //     {
  //       filename: 'webxr.html',
  //       template: 'src/pages/hello-webxr/index.html',
  //       chunks: ['webxr'],
  //     },
  //   ]);
  // },

  // esbuild: {
  //   // 防止丢弃或修改函数名称
  //   keep_names: true,
  //   //  keep_classnames: true,
  //   // 设置去除的纯函数列表
  //   pure_funcs: ['console.log', 'useWhyDidYouUpdate'],
  // },

  // pages: {
  //   index: {
  //     entry: 'src/pages/index/index.tsx',
  //     template: 'src/pages/index/index.html',
  //     filename: 'index.html',
  //     title: 'Index Page',
  //   },
  //   about: {
  //     entry: 'src/pages/about/index.tsx',
  //     template: 'src/pages/about/index.html',
  //     filename: 'about.html',
  //     title: 'About Page',
  //   },
  // },

});
