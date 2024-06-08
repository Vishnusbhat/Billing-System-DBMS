const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/', (req, res) => {
  const { transaction_date, amount, items, customer } = req.body;

  if (!amount || !items || !Array.isArray(items) || items.length === 0 || !customer) {
    console.error('Invalid request body');
    res.status(400).send('Bad request');
    return;
  }

  const insertCustomerQuery = 'INSERT INTO customer (name, phone, email) VALUES (?, ?, ?)';
  db.query(insertCustomerQuery, [customer.name, customer.phone, customer.email], (err, result) => {
    if (err) {
      console.error('Error adding customer:', err);
      res.status(500).send('Server error');
      return;
    }

    const CId = result.insertId;
    const insertInvoiceQuery = 'INSERT INTO invoice (amount, user_id) VALUES (?, ?)';
    db.query(insertInvoiceQuery, [amount, CId], (err, result) => {
      if (err) {
        console.error('Error adding invoice:', err);
        res.status(500).send('Server error');
        return;
      }

      const IId = result.insertId;
      const itemInvoiceValues = items.map(item => [item.item_id, item.count, item.total, IId]);
      const insertItemsQuery = 'INSERT INTO item_invoice (item_id, count, total, invoice_id) VALUES ?';

      db.query(insertItemsQuery, [itemInvoiceValues], (err, result) => {
        if (err) {
          console.error('Error adding item invoices:', err);
          res.status(500).send('Server error');
          return;
        }

        console.log('Invoice and associated items added successfully');
        res.status(201).send('Invoice created successfully');
      });
    });
  });
});

router.get('/details/', (req, res) => {
  console.log("Query passed: " + req.query.invoices);
  const billId = req.query.invoices;
  const sql = `
    SELECT 
      @rownum := @rownum + 1 AS serial_number,
      ii.invoice_id AS invoice_number,
      c.name AS customer_name,
      i.amount
    FROM item_invoice ii
    JOIN invoice i ON ii.invoice_id = i.iid
    JOIN invoice_customer ic ON ii.invoice_id = ic.invoice_id
    JOIN customer c ON ic.customer_id = c.cid
    JOIN (SELECT @rownum := 0) r
    WHERE ii.invoice_id = ?
    GROUP BY ii.invoice_id, c.name, i.amount;

  `;
  db.query(sql, [billId], (err, result) => {
    if (err) {
      console.error('Error fetching invoice details:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(result);
  });
});

router.get('/:invoiceId(\\d+)', (req, res) => {
  const invoiceId = req.params.invoiceId;
  console.log("Invoice ID:", invoiceId);

  const sql = 
  'SELECT * FROM invoice WHERE iid = ?';
  db.query(sql, [invoiceId], (err, results) => {
    if (err) {
      console.error('Error fetching invoices:', err);
      res.status(500).send('Server error');
      return;
    }
    console.log(results);
    res.json(results);
  });
});

router.get('/', (req, res) => {
  const sql = `
  SELECT 
    ROW_NUMBER() OVER () AS serial_number,
    invoice.iid AS invoice_id,
    invoice.amount,
    customer.name AS customer_name
  FROM 
    invoice
  JOIN 
    customer ON invoice.user_id = customer.cid;
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching invoices:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});


module.exports = router;
