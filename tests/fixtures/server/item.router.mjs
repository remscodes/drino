import { Router } from 'express';
import { service } from './item.service.mjs';

export const itemRouter = Router()
  .post('/', handleCreate)
  .get('/:id', handleGetOne)
  .get('/', handleGetAll)
  .put('/:id', handleUpdate)
  .patch('/:id', handleUpdate)
  .delete('/:id', handleDelete);

function handleCreate({ body: item }, res) {
  if (!item) return res.status(400).send(`Missing item body !`);

  res.status(201).json(service.create(item))
}

function handleGetOne({ params: { id: rawId } }, res) {
  if (!rawId) return res.status(400).send(`Missing id path parameter !`);
  const id = parseInt(rawId, 10);

  const item = service.findById(id);
  if (!item) return res.status(404).send(`Could not find item with id=${id}.`);

  res.status(200).json(item);
}

function handleGetAll(_, res) {
  res.status(200).json(service.findAll());
}

function handleUpdate({ body: updatedItem, params: { id: rawId } }, res) {
  if (!updatedItem) return res.status(400).send(`Missing item body !`);

  if (!rawId) return res.status(400).send(`Missing id path parameter !`);
  const id = parseInt(rawId, 10);

  const item = service.update(id, updatedItem);
  if (!item) return res.status(404).send(`Could not find item with id=${id}.`);

  res.status(200).json(item);
}

function handleDelete({ params: { id: rawId } }, res) {
  if (!rawId) return res.status(400).send(`Missing id path parameter !`);
  const id = parseInt(rawId, 10);

  const deleted = service.delete(id);
  if (!deleted) return res.status(404).send(`Could not find item with id=${id}.`);

  res.status(204).send();
}
