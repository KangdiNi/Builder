#!/bin/bash
source ~/.nvm/nvm.sh
set -e

workspace=$(cd $(dirname $0) && pwd -P)
cd $workspace

echo -e "workspace: $workspace"

NODE_ENV='production'
if [ ! -z "$1" ]; then
  NODE_ENV=$1
fi

## function
function build() {
  # 设置node环境变量
  export NODE_PATH=/home/kangdi/node-v8.9.1-linux-x64:/home/kangdi/node-v8.9.1-linux-x64/lib/node_modules
  export PATH=/home/kangdi/node-v8.9.1-linux-x64/bin:$PATH
  echo -e "node: `node -v`, npm: `npm -v`, yarn: `yarn -v`"

  yarn --ignore-engines
  yarn run pub

  ret=$?
  if [ $ret -ne 0 ];then
    echo "===== node build failure ====="
    exit $ret
  else
    echo "===== node build successfully! ====="
  fi
}

function make_output() {
  # upload to CDN
  if [ $NODE_ENV = "production" ];
  then
    sh boilerplate/deploy.sh;
  fi
  local output="output"
  if [ -d $output ];then
    rm -rf $output
  fi

  cp -r dist ${output}

  ret=$?
  if [ $ret -ne 0 ];then
    echo "===== Generate output failure ====="
    exit $ret
  else
    echo "===== Generate output ok ====="
  fi
}

##########################################
## main
## 其中,
## 		1.进行编译
##		2.生成部署包output
##########################################

# 1.进行编译
build

# 2.生成部署包output
# make_output

# 编译成功
echo -e "build done"
exit 0
