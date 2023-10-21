import { Router } from 'express';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { FIXTURES_ROOT_PATH } from '../fixtures.constants.mjs';

export const fileRouter = Router()
  .get('/download', handleDownload)
  .post('/upload', handleUpload)

function handleDownload(_, res) {
  const filename = 'neom-unsplash.jpg'
  const filepath = path.join(FIXTURES_ROOT_PATH, 'res', filename);

  stat(filepath).then((stats) => {
    res
      .setHeader('content-type', 'image/jpeg')
      .setHeader('content-length', stats.size)
      .setHeader('content-disposition', `attachment; filename="${filename.split('.')[0]}"`)
      .status(200);

    createReadStream(filepath).pipe(res);
  });
}

function handleUpload({ body }, res) {
  res.status(200).json('OK');
}
