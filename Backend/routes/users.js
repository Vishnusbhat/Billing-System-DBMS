const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    const sql = 'SELECT uid, username as name, role, phone_number as phone, email FROM user';
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

  router.put('/:uid/role', (req, res) => {
    const { uid } = req.params;
    const { role } = req.body;
  
    const sql = 'UPDATE user SET role = ? WHERE uid = ?';
    db.query(sql, [role, uid], (error, results) => {
      if (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Server error', error });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json({ message: 'User role updated successfully' });
    });
  });

  router.get('/:uid', (req, res) => {
    const uid  = req.params.uid;
    const sql = 'SELECT * FROM user where uid = ?';
    db.query(sql, [ uid ],(err, results) => {
      if (err) {
        console.error('Error fetching bills:', err);
        res.status(500).send('Server error');
        return;
      }
      res.json(results);
      console.log(results);
    });
  });

  //login logic
  router.get('/role/:username', (req, res) => {
    const username = req.params.username;
    const sql = 'select role, password from user where username = ?';
    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error('Error fetching bills:', err);
        res.status(500).send('Server error');
        return;
      }
      res.json(results);
      console.log(results);
    });
  });

  router.post('/signup', (req, res) => {
    const { username, password, phoneNumber, email} = req.body;
    const sql = 'INSERT INTO user (username, password, phone_number, email, role) values (?, ?, ?, ?, "user")';
    db.query(sql, [username, password, phoneNumber, email], (err, results) => {
      if (err) {
        console.error('Error adding user:', err);
        res.status(500).send('Server error');
        return;
      }
      res.json(results);
      console.log(results);
    });
  });



module.exports = router;