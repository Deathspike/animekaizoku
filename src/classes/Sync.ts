import * as app from '..';
import childProcess from 'child_process';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import util from 'util';

export class Sync {
  private readonly _episodePath: string;
  private readonly _subtitlePath: string;

  constructor(episodePath: string, subtitleFormat: string) {
    this._episodePath = episodePath;
    this._subtitlePath = `${this._episodePath}.${subtitleFormat}`;
  }

  async disposeAsync() {
    await fs.remove(this._subtitlePath);
  }

  async saveAsync(streamUrl: string, subtitle: string, options?: {broker?: app.Broker, userAgent?: string}) {
    const cli = {'user_agent': options?.userAgent};
    const env = {'http_proxy': options?.broker?.address};
    await fs.ensureDir(path.dirname(this._episodePath));
    await fs.writeFile(this._subtitlePath, subtitle);
    await util.promisify(childProcess.exec)(`${ffmpeg()} ${parse(cli)} -y -i "${streamUrl}" -i "${this._subtitlePath}" -c copy "${this._episodePath}"`, {env});
  }
}

function ffmpeg() {
  if (os.platform() !== 'win32') return 'ffmpeg';
  return path.join(__dirname, `../../dep/ffmpeg.exe`)
}

function parse<T>(obj: {[k: string]: T}) {
  return Object.entries(obj)
    .filter(([_, v]) => Boolean(v))
    .map(([k, v]) => `-${k} "${v}"`)
    .join(' ');
}
