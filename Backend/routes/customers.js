const express = require('express');
const router = express.Router();
const db = require('../db'); // Import your database connection module

// GET all customers
router.get('/', async (req, res) => {
  console.log("get customers called");
  const sql = 'SELECT * FROM customer';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
    console.log(results);
  });
});

// GET customer by ID
router.get('/:id', async (req, res) => {
  const customerId = req.params.id;
  try {
    const customer = await db.query('SELECT * FROM customer WHERE cid = ?', [customerId]);
    if (customer.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Search customers
// router.get('/', async (req, res) => {
//   const query = req.query.query;
//   try {
//     const customers = await db.query('SELECT * FROM customer WHERE name LIKE ?', [`%${query}%`]);
//     res.json(customers);
//   } catch (error) {
//     console.error('Error searching for customers:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

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

router.post('/:cid/customers', (req, res) => {
    const { cid } = req.params;
    const { name } = req.body;
  
    if (!name) {
      console.error('Missing data in request body');
      res.status(400).send('Bad request');
      return;
    }
  
    const sql = 'INSERT INTO customer (name, category_id) VALUES (?, ?)';
    db.query(sql, [name, cid], (err, result) => {
      if (err) {
        console.error('Error adding customer:', err);
        res.status(500).send('Server error');
        return;
      }
      console.log('Customer added successfully');
      res.status(201).json({ name, cid: result.insertId });
    });
  });
  

module.exports = router;
