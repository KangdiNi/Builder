import * as path from 'path';

export function Root(...paths: string[]) {
  return path.join(process.cwd(), ...paths);
  // process.cwd() 是当前执行node命令时候的文件夹地址 ——工作目录, 保证了文件在不同的目录下执行时，路径始终不变
  // __dirname 是被执行的js 文件的地址 ——文件所在目录, 实际上不是一个全局变量，而是每个模块内部的
};