const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  const sql = `
    SELECT i.*, c.name AS category_name, s.name AS subcategory_name
    FROM items i
    LEFT JOIN subcat s ON i.subcat_id = s.scid
    LEFT JOIN category c ON s.category_id = c.cid
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching items:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { name, price, toggle, subcat_id } = req.body;

  if (name === undefined || price === undefined || toggle === undefined) {
    console.error('Missing data in request body');
    res.status(400).send('Bad request');
    return;
  }

  const sql = 'INSERT INTO items (name, price, toggle, subcat_id) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, price, toggle, subcat_id], (err, result) => {
    if (err) {
      console.error('Error adding item:', err);
      res.status(500).send('Server error');
      return;
    }
    console.log('Item added successfully');
    res.status(201).send('Item added successfully');
  });
});

router.delete('/:iid', (req, res) => {
  const { iid } = req.params;
  console.log(iid);
  const sql = 'DELETE FROM items WHERE iid = ?';
  db.query(sql, [iid], (err, result) => {
    if (err) {
      console.error('Error deleting item:', err);
      res.status(500).send('Server error');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Item not found');
      return;
    }
    console.log('Item deleted successfully');
    res.status(200).send('Item deleted successfully');
  });
});

router.get('/suggestions', (req, res) => {
  const { query } = req.query;
  const sql = `
    SELECT *
    FROM items
    WHERE name LIKE '%${query}%'
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching items suggestions:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

module.exports = router;
