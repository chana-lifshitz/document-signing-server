const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const path = require('path');
const documentRoutes = require('./Routs/documentRoutes');
const port = process.env.PORT || 10000;
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use('/api/documents', documentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((err, req, res, next) => {
  if (err instanceof URIError) {
    console.error('Caught URIError:', err.message);
    return res.status(400).send('Bad Request: Invalid URL encoding');
  }
  next(err);
});
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
