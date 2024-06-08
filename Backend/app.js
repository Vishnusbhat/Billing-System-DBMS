const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/items', require('./routes/items'));
app.use('/category', require('./routes/categories'));
app.use('/bills', require('./routes/bills'));
app.use('/invoices', require('./routes/invoices'));
app.use('/stores', require('./routes/stores'));
app.use('/storages', require('./routes/storage'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
