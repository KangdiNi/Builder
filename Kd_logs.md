# 一、vscode 工具：

## 1. project-tree 自动生成项目目录结构

步骤如下：
（1）vscode 安装插件，project-tree；
（2）安装之后按 command + shift + p，并输入 Project Tree 回车；
（3）点击要生成目录的项目，回车；
（4）将项目目录生成并存储到 README.md 中；
注意：在.gitignore 中去除不需要文件

# 二、项目必备配置文件，以及常用配置说明

.gitignore
.eslintrc
.npmrc
.npmignore
.prettierrc
tsconfig.json
package.json
build.sh

## 1. .npmrc / npm 配置项

更改项目的 npm 配置

相当于 npm config ls -l 查看配置 + npm config set xxxx xxxx
常用的配置有：

> registry=http://abcd.efgh
> sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
> proxy=http://192.168.1.1:8080

关于 sass_binary_site：
配置原因：在利用 npm 安装 node-sass 依赖时，会从 github.com 上下载 .node 文件。由于国内网络环境的问题，这个下载时间可能会很长，甚至导致超时失败。

解决方案（共三种）：
（1）设置变量 sass_binary_site，指向淘宝镜像地址。
（2）使用 cnpm
（3）下载 .node 到本地
到这里去根据版本号、系统环境，选择下载 .node 文件：https://github.com/sass/node-sass/releases
然后安装时，指定变量 sass_binary_path，如：
npm i node-sass --sass_binary_path=/Users/lzwme/Downloads/darwin-x64-48_binding.node
安装失败后重新安装问题， 之前安装失败，再安装就不去下载了，怎么办呢？那就先卸载再安装：
npm uninstall node-sass && npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/

关于 proxy:
npm 命令是 node.js 的包管理工具，安装外部模块时只需 npm install packagname 即可，但是对于上网时使用代理的却安装不了.
对于此种情况只需设置一下 npm 的环境变量就可以了，运行如下命令： npm config set proxy=http://192.168.1.1:8080

## 2. .npmignore 发包发布内容黑名单

优先级不同，package.json/files > .npmignore > .gitignore

npm 允许开发者通过配置来指定待发布内容:

1.当前包目录下，只要.npmignore 存在，那么以.npmignore 为准，没有被.npmignore 忽略的内容都会被上传，即使.gitignore 已经忽略该文件。毕竟是专用配置文件，优先级最高。 2.不存在.npmignore，但有.gitignore，会以.gitignore 为准。这里也说得过去，一般无需通过 git 进行管理的文件，一般是无关内容，例如.vscode 等环境配置相关。 3.没有.gitignore 或者 .npmignore，上所有文件都会上传。 4.有一种情况例外，package.json 中存在 files 字段，可以理解为 files 为白名单，ignore 文件为黑名单：
files:["src","types"]

## 3. .eslintrc 待整理，拆分解析 npm 包

## 4. .prettierrc 代码自动格式化

格式化插件再配合 eslint 规范这样写出来的代码又好看效率又高. 一个负责检查，一个负责改
(1)在 vscode 安装 prettierrc-code formatter
(2)代码保存并格式化就需要在 vscode 的 setting.json 里加上下面这句话，这样每按下 ctrl+S 是代码会根据你配置的 prettierrc 规则进行格式化:
"editor.formatOnSave": true,
(3)规则遵循优先级关系：项目根目录下的.prettierrc > setting.json 里设置的 prettier 规则

规则配置：HTML/CSS/JS/LESS 文件的 prettier 格式化规则

{
    // 使能每一种语言默认格式化规则
    "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
    },

    /*  prettier的配置 */
    "prettier.printWidth": 120, // 超过最大值换行
    "prettier.tabWidth": 2, // 缩进字节数
    "prettier.useTabs": false, // 缩进不使用tab，使用空格
    "prettier.singleQuote": true, // 使用单引号代替双引号
    "prettier.jsxSingleQuote": false, // 在jsx中使用单引号代替双引号
    "prettier.bracketSpacing": true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
    "prettier.trailingComma": "es5", // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
    // 上述为常用配置


    "prettier.semi": true, // 句尾添加分号
    "prettier.proseWrap": "preserve", // 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
    "prettier.arrowParens": "avoid", //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
    "prettier.disableLanguages": ["vue"], // 不格式化vue文件，vue文件的格式化单独设置
    "prettier.endOfLine": "auto", // 结尾是 \n \r \n\r auto
    "prettier.eslintIntegration": false, //不让prettier使用eslint的代码格式进行校验
    "prettier.htmlWhitespaceSensitivity": "ignore",
    "prettier.ignorePath": ".prettierignore", // 不使用prettier格式化的文件填写在项目的.prettierignore文件中
    "prettier.jsxBracketSameLine": false, // 在jsx中把'>' 是否单独放一行
    "prettier.parser": "babylon", // 格式化的解析器，默认是babylon
    "prettier.requireConfig": false, // Require a 'prettierconfig' to format prettier
    "prettier.stylelintIntegration": false, //不让prettier使用stylelint的代码格式进行校验
    "prettier.tslintIntegration": false // 不让prettier使用tslint的代码格式进行校验

}

## 5. tsconfig.json 指定了用来编译这个项目的根文件和编译选项

{
  "compilerOptions": {

  ###  /* base config */

  #### base config 常用配置
    "target": "es5", 
    // 编译的目标是什么版本的(编译之后的版本)
    // 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNext'
    "module": "commonjs", 
    // 指定要使用的模块标准: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'
    "lib": [ 
      "es5",
      "es2015",
      "es2016",
      "es2017",
      "es2018",
      "dom",
      "esnext",
      "es6"
    ]
    // 编译过程中需要引入的库文件的列表
    "outDir": "dist", 
    // 输出目录,outDir用来指定输出文件夹，值为一个文件夹路径字符串，输出的文件都将放置在这个文件夹
    "allowJs": false,                       
    //allowJs设置的值为true或false，用来指定是否允许编译JS文件，默认是false，即不编译JS文件。 
    "checkJs": false,                      
    //checkJs的值为true或false，用来指定是否检查和报告JS文件中的错误，默认是false。  
    "jsx": "react",                     
    //指定jsx代码用于的开发环境: 'preserve', 'react-native', or 'react'.  

    "declaration": true,                  
    //declaration的值为true或false，用来指定是否在编译的时候生成相应的".d.ts"声明文件。
    // 如果设为true，编译每个ts文件之后会生成一个js文件和一个声明文件。
    // !!!但是declaration和allowJs不能同时设为true。
    "declarationDir": "./lib", 
    // 类型声明文件的输出目录
    "declarationMap": true,                 
    //值为true或false，指定是否为声明文件.d.ts生成map文件
    
     "sourceMap": true, 
    // ourceMap的值为true或false，用来指定编译时是否生成.map文件

    "removeComments": true, 
    // 是否移除注释

    "skipLibCheck": true,

    "experimentalDecorators": true, 
    // 启用实验性的 ES 装饰器

    "emitDecoratorMetadata": true,        
    //emitDecoratorMetadata的值为true或false，用于指定是否为装饰器提供元数据支持，
    //关于元数据，也是ES6的新标准，
    //可以通过Reflect提供的静态方法获取元数据，
    //如果需要使用Reflect的一些方法，需要引入ES2015.Reflect这个库 

     "esModuleInterop": true,                  
     //通过为导入内容创建命名空间，实现CommonJS和ES模块之间的互操作性 

    "exclude": [ // 
      "node_modules",
      "test",
      "dist"
    ],
    // exclude表示要排除的、不编译的文件，他也可以指定一个列表，
    // 规则和include一样，可以是文件可以是文件夹，可以是相对路径或绝对路径，可以使用通配符。
    
    "include": [ 
      "src/**/*"
    ],
    // 指定一个匹配列表（属于自动指定该路径下的所有 ts 相关文件）
    //include也可以指定要编译的路径列表，
    //但是和files的区别在于，这里的路径可以是文件夹，也可以是文件，
    //可以使用相对和绝对路径，而且可以使用通配符，
    //比如"./src"即表示要编译src文件夹下的所有文件以及子文件夹的文件

    "allowSyntheticDefaultImports": false,
    // allowSyntheticDefaultImports的值为true或false，用来指定允许从没有默认导出的模块中默认导入

    "baseUrl": "./", 
    //baseUrl用于设置解析非相对模块名称的基本目录，相对模块不会受baseUrl的影响，工作根目录

    "typeRoots": [
      "node_modules/@types"
    ],
    // typeRoots用来指定声明文件或文件夹的路径列表，如果指定了此项，则只有在这里列出的声明文件才会被加载。
    
    
#### 不常用配置
    "types": [ 
      "node", // 引入 node 的类型声明
    ],
    //指定引入的类型声明文件，默认是自动引入所有声明文件，一旦指定该选项，则会禁用自动引入，
    //改为只引入指定的类型声明文件，如果指定空数组[]则不引用任何文件
    "paths": { 
      "src": [ //指定后可以在文件之直接 import * from 'src';
        "./src"
      ],
      "*": ["node_modules/@types", "src/typings"]
    },
    // 指定模块的路径，和 baseUrl 有关联，和 webpack 中 resolve.alias 配置一样
    // paths用于设置模块名到基于baseUrl的路径映射
#### @types，typeRoots和types
（1）默认所有可见的"@types"包会在编译过程中被包含进来。 
node_modules/@types文件夹下以及它们子文件夹下的所有包都是可见的； 
也就是说， ./node_modules/@types/，../node_modules/@types/和../../node_modules/@types/等等。

（2）如果指定了typeRoots，只有typeRoots下面的包才会被包含进来。
这个配置文件会包含所有./typings下面的包，而不包含./node_modules/@types里面的包。

（3）如果指定了types，只有被列出来的包才会被包含进来。"types" : ["node", "lodash", "express"]
这个tsconfig.json文件将仅会包含 ./node_modules/@types/node，./node_modules/@types/lodash和./node_modules/@types/express。
/@types/。 node_modules/@types/*里面的其它包不会被引入进来

指定"types": []来禁用自动引入@types包。

  #### base config 不常用配置
    "files": [
      "demo.ts"
    ]
    //files可以配置一个数组列表，里面包含指定文件的相对或绝对路径，
    //编译器在编译的时候只会编译包含在files中列出的文件。
    //如果不指定，则取决于有没有设置include选项，
    //如果没有include选项，则默认会编译根目录以及所有子目录中的文件。
    //这里列出的路径必须是指定文件，而不是某个文件夹，而且不能使用* ? **/ 等通配符

    "outFile": "./",                       
    //outFile用于指定  将输出文件合并为一个文件，他的值为一个文件路径名，
    //比如设置为"./dist/main.js"，则输出的文件为一个main.js文件。
    //但是要注意，只有设置module的值为amd和system模块时才支持这个配置。

    "rootDir": "./",                      
    //用来指定编译文件的根目录，编译器会在根目录查找入口文件，
    //如果编译器发现以rootDir的值作为根目录查找入口文件并不会把所有文件加载进去的话会报错，但是不会停止编译。

    "composite": true,                     
    // 是否编译构建引用项目 

    "downlevelIteration": true,            
    //当target为“ES5”或“ES3”时，为“for-of”、“spread”和“destructuring”中的迭代器提供完全支持。

    "isolatedModules": true,              
    //isolatedModules的值为true或false，指定是否将每个文件作为单独的模块，
    //默认为true，他不可以和declaration同时设定。

    extends": "", 
    // extends可以通过指定一个其他的tsconfig.json文件路径，
    // 来继承这个配置文件里的配置，继承来的文件的配置会覆盖当前文件定义的配置。
    // TS在3.2版本开始，支持继承一个来自Node.js包的tsconfig.json配置文件.

    "references": [] 
    // 一个对象数组，指定要引用的项目

    "compileOnSave": true 
    // compileOnSave的值是true或false，如果设为true，
    // 在我们编辑了项目中文件保存的时候，编辑器会根据tsconfig.json的配置重新生成文件，不过这个要编辑器支持
    "allowUnreachableCode": true, // 不报告执行不到的代码错误。
    "allowUnusedLabels": false, // 不报告未使用的标签错误


  ###  /* Strict Type-Checking Options */

  #### Strict Type-Checking 常用配置
    "strict": true,     【常用】                      
    //strict的值为true或false，用于指定是否启动所有类型检查，
    //如果设为true则会同时开启下面这几个严格类型检查，默认为false。

    "noImplicitAny": false,       【常用】             
    //noImplicitAny的值为true或false，如果我们没有为一些值设置明确的类型，编译器会默认认为这个值为any类型，
    //如果将noImplicitAny设为true，则如果没有设置明确的类型会报错，默认值为false。 

  #### Strict Type-Checking 不常用配置
    "strictNullChecks": true,              
    //strictNullChecks的值为true或false，
    //当设为true时，null和undefined值不能赋值给非这两种类型的值，别的类型的值也不能赋给他们， 
    //除了any类型，还有个例外就是undefined可以赋值给void类型。 

    "strictFunctionTypes": true,           
    //strictFunctionTypes的值为true或false，用来指定是否使用函数参数双向协变检查。

    "strictBindCallApply": true,           
    //trictBindCallApply的值为true或false，设为true后会对bind、call和apply绑定的方法的参数的检测是严格检测的 
    
    "strictPropertyInitialization": true,  
    //strictPropertyInitialization的值为true或false，设为true后会检查类的非undefined属性是否已经在构造函数里初始化，如果要开启这项，需要同时开启strictNullChecks，默认为false

    "noImplicitThis": true,                
    //当 this表达式的值为 any类型的时候，生成一个错误。

    "alwaysStrict": true,           
    //alwaysStrict的值为true或false，指定始终以严格模式检查每个模块，并且在编译之后的JS文件中加入"use strict"字符串，用来告诉浏览器该JS为严格模式。

  ### /* Additional Checks */ 不常用配置
    "noUnusedLocals": true,                
    //noUnusedLocals的值为true或false，用于检查  是否有定义了但是没有使用的变量，
    //对于这一点的检测，使用ESLint可以在你书写代码的时候做提示，你可以配合使用。他的默认值为false
    "noUnusedParameters": true,            
    // noUnusedParameters的值为true或false，用于检查  是否有在函数体中没有使用的参数，
    // 这个也可以配合ESLint来做检查，他默认是false。
    "noImplicitReturns": true,            
    // noImplicitReturns的值为true或false，用于检查函数是否有返回值，
    // 设为true后，如果函数没有返回值则会提示，默认为false。 */
    "noFallthroughCasesInSwitch": true,    
    // noFallthroughCasesInSwitch的值为true或false，用于检查switch中是否有case没有使用break跳出switch，
    // 默认为false。 

  ### /* Source Map Options */ 不常用配置
    "sourceRoot": "",                      
    //sourceRoot用于指定调试器应该找到TypeScript文件而不是源文件位置，这个值会被写进.map文件里。
    "mapRoot": "",                         
    //mapRoot用于指定调试器找到映射文件而非生成文件的位置，指定map文件的根路径，
    //该选项会影响.map文件中的sources属性。
    "inlineSourceMap": true,               
    //inlineSourceMap值为true或false，指定是否将map文件的内容和js文件编译在一个同一个js文件中，
    //如果设为true，则map的内容会以//# sourceMappingURL=然后接base64字符串的形式插入在js文件底部。
    "inlineSources": true,                 
    //inlineSources的值是true或false，用于指定是否进一步将.ts文件的内容也包含到输出文件中。  
  },

  ### 配合loader
  "awesomeTypescriptLoaderOptions": { 
    "useWebpackText": true,
    "useTranspileModule": true,
    "doTypeCheck": true,
    "forkChecker": true
  }
}

## 6. build.sh

> #!/bin/sh <===>  #!/bin/bash --posix
是指此脚本使用/bin/sh来解释执行，#!是特殊的表示符，其后面跟的是解释此脚本的shell解释器的路径，脚本的内容是由解释器解释的.

我们可以用各种各样的解释器来写对应的脚本:
/bin/csh脚本，/bin/perl脚本，/bin/awk脚本，/bin/sed脚本，甚至/bin/echo等等

> source ~/.nvm/nvm.sh
source命令用法：source FileName
作用: 在当前bash环境下读取并执行FileName中的命令。
注意: 该filename文件可以无"执行权限"
其他写法: 该命令通常用命令“.”来替代
  如：source .bash_profile
  . .bash_profile两者等效。

source(或点)命令通常用于重新执行刚修改的初始化文档
  source命令(从 C Shell 而来)是bash shell的内置命令。
  点命令，就是个点符号，(从Bourne Shell而来)。

source 执行，不产生新的进程。
  所以在自定义的shell中修改环境变量，一定要使用source才能生效
  source (include) 把脚本直接在当前父shell环境中运行；


sh/bash 使用sh/bash来解释执行脚本，对应的xxx.sh没有执行权限，亦可执行;
  sh FileName
  bash FileName
  bash是sh的增强版本，在我们平常实地操作的时候如果sh这个命令不灵了我们应当使用bash

  作用:在当前bash环境下读取并执行FileName中的命令。该filename文件可以无"执行权限"
  注：两者在执行文件时的不同，是分别用自己的shell来跑文件。
    sh使用“-n”选项进行shell脚本的语法检查，使用“-x”选项实现shell脚本逐条语句的跟踪，
    可以巧妙地利用shell的内置变量增强“-x”选项的输出信息等。

source / sh 区别：
  解释： source sh01.sh 该脚本在父程序中运行；
        父程序bash
      ————————————————————————————>

      sh sh01.sh 该脚本在子程序中运行；
      父程序       sleep
      ——————> ------------- ——————>
            |              |
            v  子程序bash   v
             —————————————>

eg.
  sh执行脚本 生成子shell 而这个变量在父shell里面，而子shell中没有定义。
  可比喻为儿子没有继承老爸的财产，所以啥都没有。
    -show.sh
      #!/bin/bash
      echo  $OLDBOY
    终端输入 OLDBOY=666 （父shell中声明）
    执行 sh show.sh 无结果 （shell，因此其中没声明）
    执行 source  show.sh 有结果 （父shell中有）


./ 点杠执行，产生新的进程, 对应的xxx.sh脚本必须要有执行权限；
  使用这个命令需要先将文件提升为可执行的文件才可以进行命令的使用
  运行在一个全新的shell中，不继承当前shell的环境变量的值。按上述举例来理解。
  如果我直接运行./xxx.sh，首先你会查找脚本第一行是否指定了解释器，如果没指定，那么就用当前系统默认的shell(大多数linux默认是bash)，如果指定了解释器，那么就将该脚本交给指定的解释器。这是一个python脚本，sh看不懂

  作用:打开一个子shell来读取并执行FileName中命令。
  运行一个shell脚本时会启动另一个命令解释器.
  每个shell脚本有效地运行在父shell(parent shell)的一个子进程里.
  当脚本开头使用#！设置使用的shell类型时，使用“./”执行脚本时，则使用“#！”标志的shell解释器执行脚本；
  若无使用“#！”标记，则使用系统设置的默认shell解释器执行脚本；


> set -e
  set -e:这句之后遇到非零返回值，会直接退出
    主要作用是，当脚本执行出现意料之外的情况时，立即退出，避免错误被忽略，导致最终结果不正确
      1. 当命令的返回值为非零状态时，则立即退出脚本的执行。
      2. 作用范围只限于脚本执行的当前进行，不作用于其创建的子进程。
      3. 另外，当想根据命令执行的返回值，输出对应的log时，最好不要采用set -e选项，而是通过配合exit 命令来达到输出log并退出执行的目的。
  set +e:当这句之后遇到非零的返回值，会继续执行

> workspace=$(cd $(dirname $0) && pwd -P)
  获取路径full path
  获取shell脚本所在目录的绝对路径
  workspace: /Users/gege/Documents/kds/_Kd/webpacker
  
  pwd，是打印当前的绝对路径
  dirname 的功能是去掉文件路径名中的从右往左数的第一个/及其之后的所有文字
  $0，这是bash shell脚本执行指令中的位置参数
    bash test9.sh 10 9
    其中的$0就是test9.sh，10和9分别是$1和$2。
  pwb -P
    可以得到文件的物理路径(绝对路径)
    pwd ==> /usr/local/hadoop
    pwd -P  ==> /home/houzhizhen/usr/local/hadoop/hadoop-2.72
  解释上述指令： 
    $(dirname $0) 就是 .
    然后执行 cd .
    然后执行 pwd -P   

> cd $workspace

> echo -e "workspace: $workspace"

  echo -n 不换行输出
  举例：
    echo "1234"
    echo "5678"
    最终输出 
      1234
      5678
    echo -n "1234"
    echo "5678"
    最终输出 12345678

echo -e 处理特殊字符

    若字符串中出现以下字符，则特别加以处理，而不会将它当成一般文字输出：
    \a 发出警告声；
    \b 删除前一个字符；
    \c 最后不加上换行符号；
    \f 换行但光标仍旧停留在原来的位置；
    \n 换行且光标移至行首；
    \r 光标移至行首，但不换行；
    \t 插入tab；
    \v 与\f相同；
    \ 插入\字符；
    \nnn 插入nnn（八进制）所代表的ASCII字符；

> NODE_ENV='production'

> if [ ! -z "$1" ]; then    // 不为空
>   NODE_ENV=$1
> fi

  条件判断命令test和[,
  使用 [ 命令的时候，一般在结尾加上 ] 符号，使代码更具可读性。在使用 [ 命令时，[ 符号与被检查的语句之间应该留有空格。shell 中通常使用 test 命令来产生控制结构所需要的条件，根据 test 命令的退出码决定是否需要执行后面的代码。

  字符串比较：
    使用字符串比较的时候，必须给变量加上引号 "  " ，避免因为空字符或字符串中的空格导致一些问题。实际上，对于条件测试语句里的变量，都建议加上双引号，能做字符串比较的时候，不要用数值比较。

    举例：
      str1="zhiwen"
      str2="wenzi"

      #用test命令,test语句的结果将作为if的判断条件，如果为真即条件为真，则执行if下面的语句
      if test "$str1" = "$str2" ; then
          ....
      fi
      
      #用[命令的话，可以这样，注意[与表达式之间要有空格
      if [ "$str1" != "$str2" ] ; then
          ....
      fi
      
      #-n string,如果字符串不为空则结果为真
      if [ -n "$str1" ] ; then
          ....
      fi
      
      #-z string，如果字符串为空（null），则结果为真
      if [ -z "$str1" ] ; then
          ....
      fi
      if [ ! -z "$str1" ] ; then

    算术比较：
        #expr1 -eq expr2 如果两个表达式相等，则结果为真
        if [ "$num1" -eq "$num2" ] ; then
            ...
        fi
        
        #expr1 -ne expr2 如果两个表达式不相等，则结果为真
        if [ "$num1" -ne "$num2" ] ; then
            ....
        fi
        
        #expr1 -gt expr2 如果 expr1 > expr2 ，则结果为真
        if [ "$num1" -gt "$num2" ] ; then
            ....
        fi
        
        #expr1 -ge expr2 如果 expr1 >= expr2 ，则结果为真
        
        #expr1 -lt expr2 如果 expr1 < expr2，则结果为真
        
        #expr1 -le expr2 如果 expr1 <= expr2，则结果为真

    文件条件测试:
        -d file	如果文件是一个目录，则结果为真
        -e file	如果文件存在，则结果为真。注意，历史上 -e 选项不可移植，所以通常使用的是 -f 选项　　
        -f file	如果文件存在且为普通文件，则结果为真
        -g file	如果文件的 set-group-id 位被设置，则结果为真
        -r file	如果文件可读，则结果为真
        -s file	如果文件大小不为 0 ，则结果为真
        -u file	如果文件的 set-user-id 为被设置，则结果为真
        -w file	如果文件可写，则结果为真
        -x file	如果文件可执行，则结果为真

        


>  \#\# function
>  function build() {
>    \# 设置node环境变量, 创建环境变量并赋值
>     export NODE_PATH=/home/xiaohong/node-v8.9.1-linux-x64:/home/xiaohong/node-v8.9.1-linux-x64/lib/node_modules
>     export PATH=/home/xiaohong/node-v8.9.1-linux-x64/bin:$PATH
>     echo -e "node: `node -v`, npm: `npm -v`, yarn: `yarn -v`"
>
>     yarn install --ignore-engines
>     yarn run pub

>     ret=$?  // 之前命令的执行结束状态
>     if [ $ret -ne 0 ] ; then
>       echo "===== node build failure ====="
>       exit $ret
>     else
>       echo "===== node build successfully! ====="
>     fi
>   } 


> function make_output() {
>  \# upload to CDN
>   if [ $NODE_ENV = "production" ]; then
>     sh boilerplate/deploy.sh;
>   fi

>   local output="output"
>   if [ -d $output ];then
>     rm -rf $output
>   fi
> 
>   cp -r dist ${output}
> 
>   ret=$?
>   if [ $ret -ne 0 ];then
>     echo "===== Generate output failure ====="
>     exit $ret
>   else
>     echo "===== Generate output ok ====="
>   fi
> }


> ##########################################
> \## main
> \## 其中,
> \## 		1.进行编译
> \##		2.生成部署包output
> ##########################################
> 
> \# 1.进行编译
> build
>
> \# 2.生成部署包output
> make_output
> 
> \# 编译成功
> echo -e "build done"
> exit 0


主要的系统环境变量：
    $HOME	当前用户的家目录
    $PATH 以冒号分隔的用来搜索命令的目录列表，决定了shell将到哪些目录中去寻找命令或程序
    $0    shell 脚本的名字
    $?    最后运行的命令的结束代码（返回值）即执行上一个指令的返回值 (显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误)
    $$    shell 脚本的进程号（PID），脚本程序通常会用它来生成一个唯一的临时文件，如/tmp/tmpfile_$$


指令：
    break 退出for、while、until或case语句
    cd 改变到当前目录
    continue 执行循环的下一步
    echo 反馈信息到标准输出
    eval 读取参数，执行结果命令
    exec 执行命令，但不在当前shell
    exit 退出当前shell
    export 导出变量，使当前shell可利用它, 创建环境变量并赋值

    pwd 显示当前目录
    read 从标准输入读取一行文本
    readonly 使变量只读
    return 退出函数并带有返回值
    set 控制各种参数到标准输出的显示
    shift 命令行参数向左偏移一个
    test 评估条件表达式
    times 显示shell运行过程的用户和系统时间
    trap 当捕获信号时运行指定命令
    ulimit 显示或设置shell资源
    umask 显示或设置缺省文件创建模式
    unset 从shell内存中删除变量或函数
    wait 等待直到子进程运行完毕
    local kd_value #定义本地变量output

控制结构：
        if condition1
        then
            statements1
        elif condition2
        then
            statements2
        else
            statements3


        for variable in values
        do
          statements
        done


        在 while 和 until 语句中，condition 是判断条件，不同的是，while 语句中，若判断条件为真，则执行循环体；until 语句中，若判断条件为真，则停止执行循环体。
        while condition
        do
            statements
        done


        until condition
        do
            statements
        done

单引号与双引号的用法，在单引号中，所有特殊字符都没有特殊含义；
在双引号中,"$"、" \` "反引号、"\"有特殊含义，其余的没有特殊含义。
至于反引号 " ` "，反引号中可以用来引用系统命令，其中的内容将会被优先执行，其功能与$(...)一样


## 7.yarn
忽略引擎检查
  yarn install --ignore-engines


## 8.操作指令
rm -rf 表示删除文件，而且可以删除非空目录。-rf参数表示递归强制删除。
rm 删除命令, r参数是递归删除，删除目录及目录下的文件时使用的，f参数表示删除不询问，直接删除 
cp -r source target 递归复制
