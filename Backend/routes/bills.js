const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/', (req, res) => {
  const { amount, store, items } = req.body;

  if (!amount || !items || !Array.isArray(items) || items.length === 0 || !store) {
    console.error('Invalid request body');
    res.status(400).send('Bad request');
    return;
  }

  const insertBillQuery = 'INSERT INTO bill (amount, store) VALUES (?, ?)';
  db.query(insertBillQuery, [amount, store], (err, result) => {
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
  const sql = 'SELECT bill.*, branch.name as name FROM bill  join branch on branch.bid = bill.store';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching bills:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
    console.log(results);
  });
});

router.get('/filter', (req, res) => {
  console.log("request params: " + req.query.store);
  const store = req.query.store;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const startPrice = req.query.startPrice ? parseInt(req.query.startPrice) : null;
  const endPrice = req.query.endPrice ? parseInt(req.query.endPrice) : null;
  let sql = 'SELECT * FROM bill join branch on bill.store = branch.bid WHERE 1=1';
  const params = [];

  if (store) {
      sql += ' AND branch.name = ?';
      params.push(store);
  }

  if (startDate) {
      sql += ' AND transaction_date >= ?';
      params.push(startDate);
  }

  if (endDate) {
      sql += ' AND transaction_date <= ?';
      params.push(endDate);
  }

  if (startPrice) {
      sql += ' AND amount >= ?';
      params.push(startPrice);
  }

  if (endPrice) {
      sql += ' AND amount <= ?';
      params.push(endPrice);
  }

  console.log("params: ", params);
  console.log("query: ", sql);

  const formattedQuery = db.format(sql, params);
  console.log("Formatted query: ", formattedQuery);

  db.query(formattedQuery, params, (err, results) => {
      if (err) {
          console.error('Error fetching bills for filter:', err);
          res.status(500).send('Server error');
          return;
      }
      res.json(results);
      console.log(results);
  });
});




router.get('/details/:bid(\\d+)', (req, res) => {
  console.log("Query passed: " + req.query.bid);
  const billId = req.params.bid;
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
  const sql = 'SELECT bill.*, branch.name as name FROM bill  join branch on branch.bid = bill.store WHERE bill.bid = ?';
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
