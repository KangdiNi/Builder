/**
 * happypack
 */
import * as HappyPack from 'happypack';
import { Rule } from 'webpack';
import * as os from 'os';

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

export function createHappyPlugin(id: string, loaders: Rule[]) {
  return new HappyPack({
    id,
    loaders,
    threadPool: happyThreadPool,
  });
}
