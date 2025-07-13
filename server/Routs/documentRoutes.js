const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const documentService = require('../Servises/documentService'); 
const uploadsDir = path.join(__dirname, '../uploads');

// הגדרת multer – שמירה בתיקיית uploads, שם עם תאריך
//מגדירה את האחסון של קבצים שמועלים לשרת
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// שמירת קובץ והחזרת מזהה וקישור חתימה
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileInfo = await documentService.saveFile(req.file);
    res.status(200).json({
      success: true,
      message: 'הקובץ נשמר בהצלחה',
      ...fileInfo
    });
  } catch (err) {
    console.error('שגיאה בשמירת קובץ:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאה בשמירת הקובץ',
      error: err.message
    });
  }
});

//  קבלת חתימה  לפי ID מסמך
router.post('/sign/:id', async (req, res) => {
  try {
    const { signatureData, email} = req.body;
    const { id } = req.params;
    if (!signatureData) {
      return res.status(400).json({
        success: false,
        message: 'חתימה לא סופקה'
      });
    }
    const updatedFilePath = await documentService.applySignature(id, signatureData, email);
    const savedName = path.basename(updatedFilePath); // מחלץ את שם הקובץ מהנתיב
    res.status(200).json({
      success: true,
      message: 'החתימה הוטמעה בהצלחה',
      filePath: updatedFilePath,
      savedName: savedName
    });
  } catch (err) {
    console.error('שגיאה בהטמעת חתימה:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאה בהטמעת החתימה',
      error: err.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const document = await documentService.getDocumentById(id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'מסמך לא נמצא' });
    }
    res.status(200).json({
      success: true,
      ...document
    });
  } catch (err) {
    console.error('שגיאה בקבלת פרטי המסמך:', err);
    res.status(500).json({ success: false, message: 'שגיאה בשרת', error: err.message });
  }
});

module.exports = router;
