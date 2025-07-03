// const express = require("express");
// const multer = require("multer");
// const path = require('path');
// // const router = express.Router();
// const documentService = require('../Servises/documentService');
// // const upload = multer({ dest: "uploads/" });

// // router.post("/Form", upload.single("file"), documentController.uploadDocument);
// // router.post("/sign", documentController.submitSignature);

// // module.exports = router;
// // // import express from 'express';
// // import multer from 'multer';
// // import path from 'path';

// const router = express.Router();
// // const uploadFolder = path.join(__dirname, '../uploads');

// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     cb(null, uploadFolder); // פה התיקייה החדשה
// //   },
// // הגדרה של multer – לאן לשמור ואיך לקרוא לקבצים
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../uploads'));
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });
// const upload = multer({ storage });

// // קבלה ושמירה של קובץ
// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     const fileInfo = await documentService.saveFile(req.file);
//     res.json({ message: 'קובץ נשמר בהצלחה', ...fileInfo });
//   } catch (err) {
//     console.error('שגיאה בהעלאת קובץ:', err);
//     res.status(500).json({ error: 'שגיאה בשמירת הקובץ' });
//   }
// });

// router.post('/sign/:id', async (req, res) => {
//   try {
//     const { signatureData } = req.body; // base64 של התמונה
//     const { id } = req.params;
//     const updatedFilePath = await documentService.applySignature(id, signatureData);
//     res.json({ message: 'החתימה הוטמעה במסמך', filePath: updatedFilePath });
//   } catch (err) {
//     console.error('שגיאה בהחתמה:', err);
//     res.status(500).json({ error: 'שגיאה בהטמעת החתימה' });
//   }
// });
// module.exports = router;

// //////
// // router.post('/submit-signature', async (req, res) => {
// //   try {
// //     const { id, signature } = req.body;
// //     console.log("id:", id); // זה צריך להיות ה־UUID בלבד
// //     console.log("signature:", signature.slice(0, 30) + "...");

// //     const pdfPath = await documentService.applySignature(id, signature);
// //     res.send({ message: 'החתימה נוספה בהצלחה', pdfPath });
// //   } catch (err) {
// //     console.error("שגיאה בהחתמה:", err);
// //     res.status(500).send({ error: 'שגיאה בהחתמה', details: err.message });
// //   }
// // });



// // const { addSignatureToPdf } = require("./utils/signPdf");
// // const nodemailer = require("nodemailer");

// // router.post("/sign/:id", async (req, res) => {
// //     console.log("req.body:",req.body);
// //   const { id, signature } = req.body;
// //       console.log("ffffffff:",id);
// // console.log("signaturesignature:",signature);

// //   // מצא את הקובץ המקורי לפי ה-id
// //   const files = fs.readdirSync("uploads/");
// //   const file = files.find(f => f.startsWith(id));
// //   if (!file) return res.status(404).send("File not found");

// //   const inputPath = path.join("uploads", file);
// //   const outputPath = path.join("signed", `signed-${file.replace(".docx", ".pdf")}`);

// //   // אם הקובץ הוא docx, תצטרכי להמיר אותו קודם ל־PDF (באמצעות LibreOffice למשל)

// //   await addSignatureToPdf(inputPath, signature, outputPath);

// //   // שליחת המייל
// //   const transporter = nodemailer.createTransport({
// //     service: "gmail",
// //     auth: {
// //       user: "your@email.com",
// //       pass: "your_app_password", // סיסמת אפליקציה
// //     },
// //   });

// //   await transporter.sendMail({
// //     from: "חתימות <your@email.com>",
// //     to: "your@email.com",
// //     subject: "מסמך חתום התקבל",
// //     text: "המסמך שצורף נחתם ונשלח בהצלחה",
// //     attachments: [{ filename: "signed.pdf", path: outputPath }],
// //   });

// //   res.send("OK");
// // });
///////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const documentService = require('../Servises/documentService'); 
const uploadsDir = path.join(__dirname, '../uploads');

// הגדרת multer – שמירה בתיקיית uploads, שם עם תאריך
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
    const { signatureData } = req.body;
    const { id } = req.params;
    if (!signatureData) {
      return res.status(400).json({
        success: false,
        message: 'חתימה לא סופקה'
      });
    }

    const updatedFilePath = await documentService.applySignature(id, signatureData);
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
