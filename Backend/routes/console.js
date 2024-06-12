const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/', (req, res) => {
    const sql = req.body.text; // Get the query text from the request body
    console.log(sql);
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

module.exports = router;
