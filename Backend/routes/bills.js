const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/', (req, res) => {
  const { amount, items } = req.body;

  if (!amount || !items || !Array.isArray(items) || items.length === 0) {
    console.error('Invalid request body');
    res.status(400).send('Bad request');
    return;
  }

  const insertBillQuery = 'INSERT INTO bill (amount) VALUES (?)';
  db.query(insertBillQuery, [amount], (err, result) => {
    if (err) {
      console.error('Error adding bill:', err);
      res.status(500).send('Server error');
      return;
    }

    const billId = result.insertId;
    const itemBillValues = items.map(item => [item.item_id, billId, item.count, item.total]);
    const insertItemBillQuery = 'INSERT INTO item_bill (item_id, bill_id, count, total) VALUES ?';

    db.query(insertItemBillQuery, [itemBillValues], (err, result) => {
      if (err) {
        console.error('Error adding item bills:', err);
        res.status(500).send('Server error');
        return;
      }

      console.log('Bill and associated items added successfully');
      res.status(201).send('Bill added successfully');
    });
  });
});

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM bill';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching bills:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

router.get('/details', (req, res) => {
  console.log("Query passed: " + req.query.bid);
  const billId = req.query.bid;
  const sql = `
    SELECT 
      @rownum := @rownum + 1 AS serial_number,
      i.name AS item_name,
      ib.count,
      ib.total
    FROM item_bill ib
    JOIN items i ON ib.item_id = i.iid
    JOIN (SELECT @rownum := 0) r
    WHERE ib.bill_id = ?
  `;
  db.query(sql, [billId], (err, result) => {
    if (err) {
      console.error('Error fetching bill details:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(result);
  });
});

router.get('/:bid(\\d+)', (req, res) => {
  const billId = req.params.bid;
  console.log(req.params);
  const sql = 'SELECT * FROM bill WHERE bid = ?';
  db.query(sql, [billId], (err, results) => {
    if (err) {
      console.error('Error fetching bills:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
    const BId = results.insertId;
    // console.log("Bill ID: " + {results});
  });
});


module.exports = router;
