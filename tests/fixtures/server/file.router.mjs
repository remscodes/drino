import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { FIXTURES_ROOT_PATH } from '../fixtures.constants.mjs';

export const fileRouter = Router()
  .get('/download', handleDownload)
  .post('/upload', handleUpload)

function handleDownload(_, res) {
  const filename = 'neom-unsplash.jpg'
  const filepath = path.join(FIXTURES_ROOT_PATH, 'res', filename);
  const stats = fs.statSync(filepath);

  res
    .setHeader('content-type', 'image/jpeg')
    .setHeader('content-length', stats.size)
    .setHeader('content-disposition', `attachment; filename="${filename.split('.')[0]}"`)
    .status(200);
  fs.createReadStream(filepath).pipe(res);
}

function handleUpload(req, res) {
  res.status(200).json('OK');
}
