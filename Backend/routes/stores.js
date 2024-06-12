const express = require('express');
const db = require('../db');
const router = express.Router();


router.get('/:bid(\\d+)', (req, res) => {
  console.log("q called");
  const billId = req.params.bid;
  const sql = 'SELECT * FROM branch WHERE bid = ?';
  db.query(sql, [billId], (err, results) => {
    if (err) {
      console.error('Error fetching bill:', err);
      res.status(500).send('Server error');
      return;
    }
    console.log('selected store: ' + billId);
    res.json(results);
  });
});

router.get('/', (req, res) => {
  console.log("all get called");
  const sql = `SELECT * FROM branch`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching items:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});



router.get('/details/:bid', (req, res) => {
    const billId = req.params.bid;
    const sql = 'SELECT * FROM bill WHERE store = ?';
    db.query(sql, [billId], (err, results) => {
      if (err) {
        console.error('Error fetching bill details:', err);
        res.status(500).send('Server error');
        return;
      }
      res.json(results);
    });
});

module.exports = router;
