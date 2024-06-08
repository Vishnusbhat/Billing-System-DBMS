const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM category';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { name } = req.body;

  if (!name) {
    console.error('Missing data in request body');
    res.status(400).send('Bad request');
    return;
  }

  const sql = 'INSERT INTO category (name) VALUES (?)';
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error('Error adding category:', err);
      res.status(500).send('Server error');
      return;
    }
    console.log('Category added successfully');
    res.status(201).json({ name, cid: result.insertId });
  });
});

router.get('/:cid/subcat', (req, res) => {
  const { cid } = req.params;
  const sql = 'SELECT * FROM subcat WHERE category_id = ?';
  db.query(sql, [cid], (err, results) => {
    if (err) {
      console.error('Error fetching subcategory:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

router.post('/:cid/subcat', (req, res) => {
  const { cid } = req.params;
  const { name } = req.body;

  if (!name) {
    console.error('Missing data in request body');
    res.status(400).send('Bad request');
    return;
  }

  const sql = 'INSERT INTO subcat (name, category_id) VALUES (?, ?)';
  db.query(sql, [name, cid], (err, result) => {
    if (err) {
      console.error('Error adding subcategory:', err);
      res.status(500).send('Server error');
      return;
    }
    console.log('Subcategory added successfully');
    res.status(201).json({ name, scid: result.insertId });
  });
});

module.exports = router;
