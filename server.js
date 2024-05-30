const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // Built-in middleware for parsing JSON bodies

// Create connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'dbms'
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('MySQL connected...');
});


app.get('/items', (req, res) => {
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
    // console.log(results);
    res.json(results);
  });
});


// Add item
app.post('/items', (req, res) => {
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

// Delete item
app.delete('/items/:iid', (req, res) => {
  const { iid } = req.params;
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

app.get('/category', (req, res) => {
  const sql = 'SELECT * FROM category';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// Add category
app.post('/category', (req, res) => {
  const { name } = req.body;

  if (!name) {
    console.error('Missing data in request body');
    res.status(400).send('Bad request');
    return;
  }

  const sql = 'INSERT INTO category (name) VALUES (?)';
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error('Error adding category:', err);
      res.status(500).send('Server error');
      return;
    }
    console.log('Category added successfully');
    res.status(201).json({ name, cid: result.insertId });
  });
});

// Get subcategories by category ID
app.get('/category/:cid/subcat', (req, res) => {
  const { cid } = req.params;
  const sql = 'SELECT * FROM subcat WHERE category_id = ?';
  db.query(sql, [cid], (err, results) => {
    if (err) {
      console.error('Error fetching subcategory:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});



// Add subcategory
app.post('/category/:cid/subcat', (req, res) => {
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

app.get('/items/suggestions', (req, res) => {
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

// Add endpoint to handle adding bills
app.post('/bills', (req, res) => {
  const { amount, items } = req.body;
 console.log("amount" + amount);
  if (!amount || !items || !Array.isArray(items) || items.length === 0) {
    console.log(req.body);
    console.error('Invalid request body');
    res.status(400).send('Bad request');
    return;
  }

  // Insert the bill into the database
  const insertBillQuery = 'INSERT INTO bill (amount) VALUES (?)';
  db.query(insertBillQuery, [amount], (err, result) => {
    if (err) {
      console.error('Error adding bill:', err);
      res.status(500).send('Server error');
      return;
    }

    // Get the ID of the inserted bill
    const billId = result.insertId;

    // Prepare the array of values to be inserted into the item_bill table
    const itemBillValues = items.map(item => [item.item_id, billId, item.count, item.total]);

    // Insert items into the item_bill table
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
