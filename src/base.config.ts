/**
 * @description webpack 基础配置
 * @author nikangdi
 * @date 2021-03-04
 */
import { Root } from './utils';
import merge from 'webpack-merge';
/**
 * 深度的进行一个merge类似lodash.merge()
 */
import * as webpack from 'webpack';
import { createHappyPlugin } from './happypack';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as WebpackDevServer from 'webpack-dev-server';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as ParallelUglifyPlugin from 'webpack-parallel-uglify-plugin';
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const optimizeCss = require('optimize-css-assets-webpack-plugin');
// 配置
export interface Configuration extends webpack.Configuration, WebpackDevServer.Configuration { }

// 配置参数
export interface ConfigOptions {
  moduleName: string; // 线上环境的静态文件节点名称/或者节点位置
  devPort?: number;
  static: string; // 镜像节点 举例 https://static.global.com， 注意最后没有反斜杠
  report?: boolean; //是否打印日志报告
}

//获取基础配置
export function getBaseConfig(options: ConfigOptions) {
  const config: Configuration = {
    mode: 'none', //由指定环境config的mode进行配置，默认production

    entry: {
      app: Root('src/index'), // name ==> app
    },

    output: {
      path: Root("dist"),
      /**
       * path是webpack所有文件的输出的路径，必须是绝对路径，、
       * 
       * 比如：output输出的js,url-loader解析的图片，HtmlWebpackPlugin生成的html文件，都会存放在以path为基础的目录下， 
       * “path”仅仅告诉Webpack结果存储在哪里，
       */
      publicPath: '/',
      //“publicPath”项则被许多Webpack的插件用于在生产模式下更新内嵌到css、html文件里的url值， “publicPath”项则被许多Webpack的插件用于在生产模式下更新内嵌到css、html文件里的url值
      /**
       * 例如，在localhost（即本地开发模式）里的css文件中边你可能用“./test.png”这样的url来加载图片，但是在生产模式下“test.png”文件可能会定位到CDN上并且你的Node.js服务器可能是运行在HeroKu上边的。这就意味着在生产环境你必须手动更新所有文件里的url为CDN的路径。
       * 
       * 主要是在生产模式下，对你的页面里面引入的资源的路径做对应的补全
       * 比如在 prod配置 publicPath: `https://static.global.com/${options.moduleName}/`, 生产环境url loader会把css中的url直接更新为 https://static.global.com/${options.moduleName}/xxxxx
       * 在dev/test 配置 publicPath: '/',
       * 在开发阶段，我们要用devServer启动一个开发服务器，这里也有一个publicPath需要配置。
       * webpack-dev-server打包的文件是放在内存中的而不是本地上，这些打包后的资源对外的根目录就是publicPath。
       * http://localhost:9000/dist/  +  资源名， 就可以访问到该资源
       * 
       * 生产环境： 当打包的时候，webpack会在静态文件路径前面添加publicPath的值，当我们把资源放到CDN上的时候，把publicPath的值设为CDN的值就可以了
       * 开发环境： 但是当我们使用webpack-dev-server 进行开发时，它却不是在静态文件的路径上加publicPath的值，相反，它指的是webpack-dev-server 在进行打包时生成的静态文件所在的位置, 相当于/+url
       */
      filename: "assets/js/[name]_[hash:8].js", // app_HHHJKKLS.js
      chunkFilename: 'assets/js/chunks/[name]_[contenthash:8].js',
      /**
       * chunkname我的理解是未被列在entry中，却又需要被打包出来的文件命名配置。
       * 
       * 什么场景需要呢？
       * 在按需加载（异步）模块的时候，这样的文件是没有被列在entry中的，如使用CommonJS的方式异步加载模块
       * require.ensure(["modules/tips.jsx"], function(require) { var a = require("modules/tips.jsx"); // ... }, 'tips');
       */
    },
    resolve: {
      modules: [Root('node_modules'), 'node_modules', Root('src')],
      /**
       * 配置 Webpack 去哪些目录下寻找第三方模块，默认是只会去  node_modules  目录下寻找
       * 
       * 为什么有src ？
       * 有时你的项目里会有一些模块会大量被其它模块依赖和导入，
       * 由于其它模块的位置分布不定，针对不同的文件都要去计算被导入模块文件的相对路径， 这个路径有时候会很长，
       * 就像这样  import '../../../components/button'  
       * 这时你可以利用  modules  配置项优化，
       * 假如那些被大量导入的模块都在  ./src/components  目录下，把  modules  配置成modules:['./src/components','node_modules']后，
       * 你可以简单通过  import 'button'  导入。
       */

      // alias: {
      //   //   components: './src/components/'
      // }
      /**
       * 当你通过  import Button from 'components/button 导入时，实际上被 alias 等价替换成了  import Button from './src/components/button' 。
       * 以上 alias 配置的含义是把导入语句里的  components  关键字替换成  ./src/components/ 。
       */
      extensions: ['.tsx', '.ts', '.jsx', '.js'], // 在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          //把对.tsx? 的文件处理交给id为happy-ts 的HappyPack 的实例执行
          use: 'happypack/loader?id=happy-ts',
          /**
           * 需要结合 happyPlugin 来处理
           * 
           * 能同一时间处理多个任务，发挥多核 CPU 电脑的威力，HappyPack 就能让 Webpack 做到这点，
           * 它把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程
           * 
           * js 的情况
           * 把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
           * loader: 'happypack/loader?id=happyBabel',
           */
          exclude: /node_modules/,
        },
        {
          test: /\.jpe?g$|\.ico$|\.png$|\.svg$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: 'assets/images/',
            },
          },
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: 'assets/media/[name].[hash:7].[ext]',
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: 'assets/fonts/[name].[hash:7].[ext]',
          },
        },
        // {test: /\.js$/, use: 'babel-loader', exclude: /node_modules/},
        // {
        //   test: /\.md$/,
        //   use: {
        //     loader: 'raw-loader',
        //     options: {
        //       name: '[name].[hash:8].[ext]',
        //       outputPath: 'assets/docs/',
        //     },
        //   },
        // },
      ],
    },
    optimization: {
      //增加模块标识: development默认都为true, production默认为false，选择是否给module和chunk更有意义的名称
      namedModules: true, // 形式有所不同： 为true打包编译之后会是{'./src/b.js': （funciton()） }, 为false会是[（function()）]
      namedChunks: true, // false采用索引[1,2,1], true [1,"runtime~app","b"]
      splitChunks: {
        chunks: 'async', // 默认
        // 同时分割同步和异步代码,
        // 拆分模块的范围，它有三个值async、initial和all
        // async表示只从异步加载得模块（动态加载import()）里面进行拆分 initial表示只从入口模块进行拆分 all表示以上两者都包括
        minSize: 30000, // 最小拆分组件大小
        minChunks: 1, // 最小引用次数
        maxAsyncRequests: 5,
        // 限制异步模块内部的并行最大请求数的，对应chunks => async
        // 当整个项目打包完之后，一个按需加载的包最终被拆分成n个包，maxAsyncRequests就是用来限制n的最大值
        maxInitialRequests: 3,
        // 允许入口并行加载的最大请求数 ，同上，对应chunks => initial
        name: true, //split 的 chunks name， 默认为true，返回${cacheGroup的key} ${automaticNameDelimiter} ${moduleName},可以自定义
        cacheGroups: { // 设置缓存的 chunks
          'ui-libs': {
            test: chunk => chunk.resource && /\.js$/.test(chunk.resource) && /node_modules/.test(chunk.resource) && /react|mobx|redux|antd|@ant-*|ora-ui/.test(chunk.resource),
            chunks: 'initial',
            name: 'ui-libs',
            priority: 4,
          },
          'chart-libs': {
            test: chunk => chunk.resource && /\.js$/.test(chunk.resource) && /node_modules/.test(chunk.resource) && /echarts/.test(chunk.resource),
            chunks: 'initial',
            name: 'chart-libs',
            priority: 3,
          },
          vendors: {
            test: chunk => chunk.resource && /\.js$/.test(chunk.resource) && /node_modules/.test(chunk.resource),
            chunks: 'initial',
            name: 'vendors',
            priority: 1,
          },
          'async-vendors': {
            test: /[\\/]node_modules[\\/]/,
            minChunks: 2,
            chunks: 'async',
            name: 'async-vendors',
          },
          // 'ui-libs': {
          //   test: /antd|@ant-design|ora/,
          //   chunks: 'initial',
          //   name: 'ui-libs',
          //   priority: 4,
          // },
          // 'rc-libs': {
          //   test: /react|mobx|redux/,
          //   chunks: 'initial',
          //   name: 'rc-libs',
          //   priority: 2,
          // },
          // 'chart-libs': {
          //   test: /@antv|echarts/,
          //   chunks: 'initial',
          //   name: 'chart-libs',
          //   priority: 3,
          // },
          // vendors: {
          //   test: /node_modules/,
          //   chunks: 'initial',
          //   name: 'vendors',
          //   // minChunks: 2,
          //   enforce: true,
          //   priority: 1,
          // },
        },
      },
      runtimeChunk: {
        name: 'runtime',
        /**
         * 设置runtimeChunk是将包含chunks 映射关系的 list单独从 app.js里提取出来，
         * 因为每一个 chunk 的 id 基本都是基于内容 hash 出来的，所以每次改动都会影响它，如果不将它提取出来的话，等于app.js每次都会改变。缓存就失效了。设置runtimeChunk之后，webpack就会生成一个个runtime~xxx.js的文件。
         * 然后每次更改所谓的运行时代码文件时，打包构建时app.js的hash值是不会改变的。
         * 如果每次项目更新都会更改app.js的hash值，那么用户端浏览器每次都需要重新加载变化的app.js，
         * 如果项目大切优化分包没做好的话会导致第一次加载很耗时，导致用户体验变差。现在设置了runtimeChunk，就解决了这样的问题。
         * 所以这样做的目的是避免文件的频繁变更导致浏览器缓存失效，所以其是更好的利用缓存。提升用户体验。
         */
        /**
         * 虽然每次构建后app的hash没有改变，但是runtime~xxx.js会变啊。
         * 每次重新构建上线后，浏览器每次都需要重新请求它，它的 http 耗时远大于它的执行时间了，
         * 所以建议不要将它单独拆包，而是将它内联到我们的 index.html 之中。
         * 这边我们使用script-ext-html-webpack-plugin来实现。
         * （也可使用html-webpack-inline-source-plugin，其不会删除runtime文件。）
         */
      },
    },
    plugins: [
      // 并非旨在复制从构建过程中生成的文件，而是在构建过程中复制源树中已经存在的文件
      // new CopyPlugin({
      //   patterns: [
      //     { from: Root('src/favicon.ico'), to: '.' }
      //   ]
      // }),
      /**
       * from  定义要拷贝的源文件         from：__dirname+'/src/components'
       * to      定义要拷贝到的目标文件夹  to: __dirname+'/dist'
       * toType  file 或者 dir          可选，默认是文件
       * force   强制覆盖前面的插件        可选，默认是文件
       * context                        可选，默认base   context可用specific  context
       * flatten  只拷贝指定的文件         可以用模糊匹配
       * ignore  忽略拷贝指定的文件         可以模糊匹配
       */

      // happypack
      createHappyPlugin('happy-ts', [
        {
          loader: 'ts-loader',
          options: {
            happyPackMode: true,
            transpileOnly: true,
          },
        },
      ]),

      CleanWebpackPlugin(['dist'],{
        root: Root(), //一个根的绝对路径
        verbose: true,// 将log写到 console.
        dry: false,// 不要删除任何东西，主要用于测试.
        exclude: []//排除不删除的目录，主要用于避免删除公用的文件
      }),

      new ForkTsCheckerWebpackPlugin(),// The minimal webpack config (with ts-loader)
    ],
  };
  return config;
}

// 获取生产环境基础配置
export function getProdBaseConfig(options: ConfigOptions) {
  const base = getBaseConfig(options);

  return merge(base, {
    mode: "production",

    module: {
      rules: [
        {
          test: /.s?css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
          /**
           * mini-css-extract-plugin:
           * 从css文件中提取css代码到单独的文件中，对css代码进行代码压缩等
           * 
           * 版本兼容坑。
           * 在使用mini-css-extract-plugin的0.9.0版本的时候估计是和其他某个插件冲突了，会有这么一个错误
           * No module factory available for dependency type: CssDependency
           * 可以尝试降级到0.8.2或者0.8.0版本即可解决
           * 
           * 第二个，使用了mini-css-extract-plugin的loader必须配合plugin部分一起使用。
           */
        },
        {
          test: /.less$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
        }
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '/assets/styles/style_[hash:8].css',
      }),
      
      new optimizeCss({
        cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
        cssProcessorOptions: { 
          discardComments: { removeAll: true } 
        },
        canPrint: true //是否将插件信息打印到控制台
      })
    ],

    optimization: {
      minimizer: [
        new ParallelUglifyPlugin({
          cacheDir: '.cache/',
          // 缓存压缩后的结果，下次遇到一样的输入时直接从缓存中获取压缩后的结果并返回，
          // cacheDir 用于配置缓存存放的目录路径。默认不会缓存，想开启缓存请设置一个目录路径。
          uglifyES: {
            // 用于压缩 ES6 代码时的配置，Object 类型，直接透传给 UglifyES 的参数。
            // uglifyJS：用于压缩 ES5 代码时的配置，Object 类型，直接透传给 UglifyJS 的参数。
            output: {
              comments: false,
              beautify: false,
            },
            compress: {
              drop_console: false,
              collapse_vars: true,
              reduce_vars: true,
            },
          },
          /**
           * test: 使用正则去匹配哪些文件需要被 ParallelUglifyPlugin 压缩，默认是 /.js$/.
           * include: 使用正则去包含被 ParallelUglifyPlugin 压缩的文件，默认为 [].
           * exclude: 使用正则去不包含被 ParallelUglifyPlugin 压缩的文件，默认为 [].
           * workerCount：开启几个子进程去并发的执行压缩。默认是当前运行电脑的 CPU 核数减去1。
           * sourceMap：是否为压缩后的代码生成对应的Source Map, 默认不生成，开启后耗时会大大增加，一般不会将压缩后的代码的
           */
        })
      ]
    },
    /**
     * webpack默认提供了UglifyJS插件来压缩JS代码，
     * 但是它使用的是单线程压缩代码，
     * 也就是说多个js文件需要被压缩，它需要一个个文件进行压缩。
     * 所以说在正式环境打包压缩代码速度非常慢(因为压缩JS代码需要先把代码解析成用Object抽象表示的AST语法树，再去应用各种规则分析和处理AST，导致这个过程耗时非常大)。
     * 
     * 当webpack有多个JS文件需要输出和压缩时候，原来会使用UglifyJS去一个个压缩并且输出，
     * 但是ParallelUglifyPlugin插件则会开启多个子进程，
     * 把对多个文件压缩的工作分别给多个子进程去完成，但是每个子进程还是通过UglifyJS去压缩代码。
     * 无非就是变成了并行处理该压缩了，并行处理多个子任务，效率会更加的提高。
     */
    devtool: "cheap-module-source-map",
  })
}

/**
 * 使用 @babel/preset-typescript 取代 awesome-typescript-loader和ts-loader
 *
 * 1. awesome-typescript-loader方案是如何对TypeScript进行处理的
 *
 * 2.@babel/preset-typescript
 * 要使用@babel/preset-typescript，务必确保你是Babel7+
 *
 * @babel/preset-typescript和@babel/preset-react类似，是将特殊的语法转换为JS
 * 但是有点区别的是，@babel/preset-typescript是直接移除TypeScript，转为JS，这使得它的编译速度飞快。
 * 并且只需要管理Babel一个编译器就行了，因为我将脚手架中的typescript库卸载后，依然可以完美运行。
 * 而且重要的是你写的TypeScript不会再进行类型检测，使得你改动代码后中断运行的页面。
 */

/**
 * ts ===> es ===> js
 * 首先我们需要知道TypeScript是一个将TypeScript转换为指定版本JS代码的编译器，
 * 而Babel同样是一个将新版本JS新语法转换为低版本JS代码的编译器。
 * 所以我们之前的方案每次修改了一点代码，都会将TS代码传递给TypeScript转换为JS，
 * 然后再将这份JS代码传递给Babel转换为低版本JS代码。
 * 因此我们需要配置两个编译器，并且每次做了一点更改，都会经过两次编译。
 */

/**
 * progress-bar-webpack-plugin
 *
 * 编译进度条插件
 * new ProgressBarPlugin()
 */

/**
 * npm-check-updates
 *
 * nodejs包高效升级插件npm-check-updates
 * ncu -a 一键升级各个包
 *
 */

/**
 * optimize-css-assets-webpack-plugin & cssnano
 * 普通压缩：
 *   plugins: [
 *       new optimizeCss()
 *   ]
 * 
 * 
 * 使用cssnano规则压缩：
 * plugins: [
 *     new optimizeCss({
 *             cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
 *             cssProcessorOptions: { 
 *             discardComments: { removeAll: true } 
 *            },
 *             canPrint: true //是否将插件信息打印到控制台
 *         })
 * ]
 */
