const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');

router.get('/', async (req, res) => {
  const { tenderId } = req.query;
  const filter = tenderId ? { tender: tenderId } : {};
  const assets = await Asset.find(filter).sort({ createdAt: -1 });
  res.json(assets);
});

router.post('/', async (req, res) => {
  try {
    const asset = await Asset.create(req.body);
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(asset);
});

router.delete('/:id', async (req, res) => {
  await Asset.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
