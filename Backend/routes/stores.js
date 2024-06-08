const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    const sql = `select * from branch`;
    console.log(req.body);
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching items:', err);
        res.status(500).send('Server error');
        return;
      }
      res.json(results);
    });
  });

  module.exports = router;