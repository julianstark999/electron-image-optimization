import { sep } from 'path';
import os from 'os';
import * as fs from 'fs';
import { shell } from 'electron';
import imagemin from 'imagemin';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';

export function createTmpDir() {
  return fs.mkdtempSync(`${os.tmpdir()}${sep}`);
}

export async function openDir(tmpDir) {
  await shell.openPath(`${tmpDir}${sep}`);
}

export async function optimizeFiles(file, outputDir) {
  const path = file.path
    .replace(/\\/g, '/')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

  return await imagemin([path], {
    destination: `${outputDir}${sep}`,
    plugins: [
      //jpg
      imageminJpegtran({
        progressive: true,
      }),
      imageminMozjpeg(),
      //png
      imageminOptipng(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
      //gif
      imageminGifsicle(),
      //svg
      imageminSvgo(),
    ],
  });
}
