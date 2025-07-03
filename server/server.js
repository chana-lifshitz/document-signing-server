const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const path = require('path');
const documentRoutes = require('./Routs/documentRoutes');

const host_name = process.env.HOST_NAME || '127.0.0.1';
const port = process.env.PORT;
app.use(cors()); // חשוב אם הלקוח בריאקט על פורט אחר
app.use(express.json({ limit: "10mb" })); // נדרש בגלל base64
// app.use(express.json()); // לפרוס JSON בבקשות POST
// כדי לשרת את התמונות מתיקיית uploads בכתובת /image/
app.use('/image', express.static(path.join(__dirname, 'uploads')));
// ייבוא הנתיבים
app.use(express.json());

app.use('/api/documents', documentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// app.use('/image', express.static(path.join(__dirname,'image')));


app.use((err, req, res, next) => {
  if (err instanceof URIError) {
    console.error('Caught URIError:', err.message);
    return res.status(400).send('Bad Request: Invalid URL encoding');
  }
  next(err);
});


app.listen(port, host_name, () => {
        console.log(`server is up in address http://${host_name}:${port}`);

});
// app.listen(3000, () => console.log("Server running on port 3000"));
