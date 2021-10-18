# Builder
  工程化项目构造工具

## 主要功能

- [ ] 热更新：完善的TypeScript + React + scss技术栈热更新支持。
- [ ] 环境区分：`process.env.D_ENV`判断，值为`dev`, `test`, `pre`, `production`。
- [ ] 构建性能优化。
- [ ] 预设拆包最佳实践。
- [ ] 完全可扩展，暴露方法可以传入对应自定义配置进行融合。


规划：
1.less -F
2.clean-webpack-plugin -F
3.babel
4.常用到的，能提升性能的打包配置/插件全部加上
5.完善为 TypeScript/javascript/ es6 + React/Vue + scss/less 技术栈热更新支持。
6.Vue
7.js/es6

```
Builder
├─ .eslintrc
├─ .npmignore
├─ .npmrc
├─ .prettierrc
├─ .vscode
│  └─ settings.json
├─ README.md
├─ build.sh
├─ package.json
├─ src
│  ├─ base.config.ts
│  ├─ dev.config.ts
│  ├─ happypack.ts
│  ├─ index.ts
│  ├─ prod.config.ts
│  ├─ test.config.ts
│  └─ utils.ts
├─ tsconfig.json
└─ yarn.lock

```

默认应用项目路径为
Project
├─ node_modules
├─ dist
│  └─ xxxx
└─ src
   ├─ index.ts
   └─  index.html

默认配置涉及：
entry (src/index.ts)
output (dist)
resolve / modules (src, node_modules)
cleanWebPackPlugins (dist)

dev:
  devServer / contentBase (dist)
  HtmlPlugin / template (src/index.html)

test:
  HtmlPlugin / template (src/index.html)  
prod,pre:
  HtmlPlugin / template (src/index.html)

