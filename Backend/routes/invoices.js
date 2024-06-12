const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/', (req, res) => {
  console.log(req.body);
  const { amount, items, customer, store } = req.body;

  if (!amount || !items || !Array.isArray(items) || items.length === 0 || !customer || !store) {
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
    const insertInvoiceQuery = 'INSERT INTO invoice (amount, user_id, store) VALUES (?, ?, ?)';
    db.query(insertInvoiceQuery, [amount, CId, store], (err, result) => {
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
      const insertIntoIC = 'INSERT INTO INVOICE_CUSTOMER VALUES (?, ?)';
      db.query(insertIntoIC, [IId, CId], (err, result) => {
      if (err) {
        console.error('Error adding into invoice_customer', err);
        res.status(500).send('Server error');
        return;
      }
      console.log('Added into invoice_customer table!');
      });

    });

    
  });
});

router.get('/details', (req, res) => {
  console.log("Query passed: " + req.query.Invoiceid);
  const billId = req.query.Invoiceid;
  const sql = `
   
    SELECT name, count, total 
FROM invoice 
JOIN item_invoice ON invoice.iid = item_invoice.invoice_id 
JOIN items ON item_invoice.item_id = items.iid
where invoice.iid = ?
  `;
  db.query(sql, [billId], (err, result) => {
    if (err) {
      console.error('Error fetching invoice details:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(result);
    console.log("selected bills list:");
  });
});

router.get('/:invoiceId(\\d+)', (req, res) => {
  const invoiceId = req.params.invoiceId;
  console.log("Invoice ID:", invoiceId);

  const sql = 
  'select iid, amount, cid, name, transaction_date, invoice.store from customer join invoice on customer.cid = invoice.user_id WHERE iid = ?';
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
    invoice.transaction_date,
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

//filter

router.get('/filter', (req, res) => {
  console.log("request params: " + req.query.store);
  const store = req.query.store;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const startPrice = req.query.startPrice ? parseInt(req.query.startPrice) : null;
  const endPrice = req.query.endPrice ? parseInt(req.query.endPrice) : null;
  let sql = 'SELECT * FROM invoice join customer on invoice.user_id = customer.cid WHERE 1=1';
  const params = [];

  if (store) {
      sql += ' AND store = ?';
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

  // console.log("params: ", params);
  // console.log("query: ", sql);

  const formattedQuery = db.format(sql, params);
  // console.log("Formatted query: ", formattedQuery);

  db.query(formattedQuery, params, (err, results) => {
      if (err) {
          console.error('Error fetching bills for filter:', err);
          res.status(500).send('Server error');
          return;
      }
      res.json(results);
      // console.log(results);
  });
});


module.exports = router;
