import { Router } from 'express';
import { setTimeout } from 'node:timers'
import { service } from './item.service.mjs';

export const itemRouter = Router()
  .post('/', ({ body: item }, res) => {
    if (!item) return res.status(400).send(`Missing item body !`);

    res.status(201).json(service.create(item))
  })
  .get('/:id', ({ params: { id: rawId } }, res) => {
    const id = parseInt(rawId, 10);
    if (!id) return res.status(400).send(`Missing id path parameter !`);

    const item = service.findById(parseInt(id, 10));
    if (!item) return res.status(404).send(`Could not find item with id=${id}.`);

    res.status(200).json(item);
  })
  .get('/', (_, res) => {
    res.status(200).json(service.findAll());
  })
  .put('/:id', ({ body: updatedItem, params: { id: rawId } }, res) => {
    const id = parseInt(rawId, 10);
    if (!id) return res.status(400).send(`Missing id path parameter !`);

    if (!updatedItem) return res.status(400).send(`Missing item body !`);

    const item = service.update(id, updatedItem);
    if (!item) return res.status(404).send(`Could not find item with id=${id}.`);

    res.status(200).json(item);
  })
  .patch('/:id', ({ body: updatedItem, params: { id: rawId } }, res) => {
    const id = parseInt(rawId, 10);
    if (!id) return res.status(400).send(`Missing id path parameter !`);

    if (!updatedItem) return res.status(400).send(`Missing item body !`);

    const item = service.update(id, updatedItem);
    if (!item) return res.status(404).send(`Could not find item with id=${id}.`);

    res.status(200).json(item);
  })
  .delete('/:id', ({ params: { id: rawId } }, res) => {
    const id = parseInt(rawId, 10);
    if (!id) return res.status(400).send(`Missing id path parameter !`);

    const deleted = service.delete(id);
    if (!deleted) return res.status(404).send(`Could not find item with id=${id}.`);

    res.status(204).send();
  })
  .get('/long', (_, res) => {
    setTimeout(() => {
      res.status(200).json(service.findAll());
    }, 3000);
  });
