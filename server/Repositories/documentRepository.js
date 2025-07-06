// // const customeredata = require('../customers_data.json').customers
// const fs = require('fs');
// const path = require('path');
// // const dataPath = path.join(__dirname, '../customers_data.json');


// // class Document_repository {
// //     constructor() {}
// // async storeFile(file){
// //   const savedPath = path.join('uploads', file.filename);
// //   // אפשר לשמור מידע נוסף בקובץ JSON נפרד אם רוצים
// //   const logPath = path.join(__dirname, '../../uploads/files-log.json');
// //   const logExists = fs.existsSync(logPath);

// //   let fileLog = logExists ? JSON.parse(fs.readFileSync(logPath, 'utf-8')) : [];

// //   fileLog.push({
// //     originalName: file.originalname,
// //     savedName: file.filename,
// //     size: file.size,
// //     mimetype: file.mimetype,
// //     savedAt: new Date().toISOString()
// //   });

// //   fs.writeFileSync(logPath, JSON.stringify(fileLog, null, 2), 'utf-8');

// //   return {
// //     savedPath,
// //     originalName: file.originalname
// //   };
// // };
// // }

// const { v4: uuidv4 } = require('uuid'); // צריך להריץ npm install uuid אם לא עשית
// // const { PDFDocument } = require('pdf-lib');
// const { PDFDocument, rgb } = require("pdf-lib");


// const libre = require('libreoffice-convert');


// // ....הפונקציה הטובה עם קישור
// class Document_repository {
//   constructor() {}

//   async storeFile(file) {
//     const savedPath = path.join('uploads', file.filename);
//     const logPath = path.join(__dirname, '../uploads/files-log.json');
//     const logExists = fs.existsSync(logPath);

//     let fileLog = logExists ? JSON.parse(fs.readFileSync(logPath, 'utf-8')) : [];

//     const documentId = uuidv4(); // מזהה ייחודי
//     const signLink = `http://localhost:3000/sign/${documentId}`; // קישור חתימה

//     const documentEntry = {
//       id: documentId,
//       originalName: file.originalname,
//       savedName: file.filename,
//       size: file.size,
//       mimetype: file.mimetype,
//       savedAt: new Date().toISOString(),
//       signLink
//     };

//     fileLog.push(documentEntry);

//     fs.writeFileSync(logPath, JSON.stringify(fileLog, null, 2), 'utf-8');

//     return {
//       id: documentId,
//       signLink,
//       savedPath,
//       originalName: file.originalname
//     };
//   }

// //   async embedSignatureToPdf(id, signatureBase64) {
// //     console.log("id:",id);
// //     console.log("signatureBase64:",signatureBase64);

// //     const logPath = path.join(__dirname, '../../uploads/files-log.json');
// //     const logData = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
// //     const fileEntry = logData.find(doc => doc.id === id);
// //     if (!fileEntry) throw new Error('מסמך לא נמצא');

// //     const pdfPath = path.join(__dirname, '../uploads', fileEntry.savedName);
// //     const fileBuffer = fs.readFileSync(pdfPath);
// //     const pdfDoc = await PDFDocument.load(fileBuffer);

// //     const signatureImage = await pdfDoc.embedPng(Buffer.from(signatureBase64, 'base64'));
// //     const page = pdfDoc.getPages()[0];

// //     page.drawImage(signatureImage, {
// //       x: 50,
// //       y: 50,
// //       width: 150,
// //       height: 50,
// //     });

// //     const modifiedPdf = await pdfDoc.save();
// //     fs.writeFileSync(pdfPath, modifiedPdf);

// //     return pdfPath;
// //   }
// async embedSignatureToPdf(id, signatureBase64) {
//   const logPath = path.join(__dirname, '../uploads/files-log.json');
//   const logData = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
//   const fileEntry = logData.find(doc => doc.id === id);
//   if (!fileEntry) throw new Error('מסמך לא נמצא');

//   let inputPath = path.join(__dirname, '../uploads', fileEntry.savedName);

//   // אם זה DOCX, תמיר ל־PDF
//   if (inputPath.endsWith('.docx')) {
//     const outputPath = inputPath.replace('.docx', '.pdf');
//     await this.convertDocxToPdf(inputPath, outputPath);
//     inputPath = outputPath; // עכשיו נשתמש בקובץ PDF המומר
//   }

//   // טען את ה־PDF
//   const fileBuffer = fs.readFileSync(inputPath);

//   const pdfDoc = await PDFDocument.load(fileBuffer);

//   const base64Data = signatureBase64.split(',')[1]; // הסר prefix אם יש
//   const signatureImage = await pdfDoc.embedPng(Buffer.from(base64Data, 'base64'));

//   const page = pdfDoc.getPages()[0];

//   page.drawImage(signatureImage, {
//     x: 50,
//     y: 50,
//     width: 150,
//     height: 50,
//   });

//   const modifiedPdf = await pdfDoc.save();
//   fs.writeFileSync(inputPath, modifiedPdf);

//   return inputPath;
// }

//   async addSignatureToPdf(pdfPath, signatureBase64, outputPath) {
//   const existingPdfBytes = fs.readFileSync(pdfPath);
//   const signatureImageBytes = Buffer.from(signatureBase64.split(",")[1], "base64");

//   const pdfDoc = await PDFDocument.load(existingPdfBytes);
//   const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
//   const pages = pdfDoc.getPages();
//   const firstPage = pages[0];

//   firstPage.drawImage(signatureImage, {
//     x: 50,
//     y: 100,
//     width: 150,
//     height: 50,
//   });

//   const pdfBytes = await pdfDoc.save();
//   fs.writeFileSync(outputPath, pdfBytes);
// }

// async convertDocxToPdf(inputPath, outputPath) {
//   return new Promise((resolve, reject) => {
//     const ext = '.pdf';
//     const file = fs.readFileSync(inputPath);
//     libre.convert(file, ext, undefined, (err, done) => {
//       if (err) return reject(err);

//       fs.writeFileSync(outputPath, done);
//       resolve();
//     });
//   });
// }

// getFilePathById(id) {
//   const logPath = path.join(__dirname, '../uploads/files-log.json');
//   const logData = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
//   const fileEntry = logData.find(doc => doc.id === id);

//   if (!fileEntry) {
//     throw new Error('קובץ עם מזהה זה לא נמצא');
//   }

//   // נחזיר רק את הנתיב לקובץ
//   return path.join(__dirname, '../uploads', fileEntry.savedName);
// }


// }
// // export default {storeFile};
// module.exports = new Document_repository();
//////////////////////////////////////////////////////////////////////////////////////////////
// const fs = require('fs');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');
// const { PDFDocument } = require('pdf-lib');
// const libre = require('libreoffice-convert');

// const logPath = path.join(__dirname, '../uploads/files-log.json');
// const uploadsDir = path.join(__dirname, '../uploads');

// class Document_repository {
//   constructor() {}

//   async storeFile(file) {
//     try {
//       const savedPath = path.join('uploads', file.filename);
//       const logExists = fs.existsSync(logPath);
//       let fileLog = logExists ? JSON.parse(fs.readFileSync(logPath, 'utf-8')) : [];

//       const documentId = uuidv4();
//       const signLink = `http://localhost:3000/sign/${documentId}`;

//       const documentEntry = {
//         id: documentId,
//         originalName: file.originalname,
//         savedName: file.filename,
//         size: file.size,
//         mimetype: file.mimetype,
//         savedAt: new Date().toISOString(),
//         signLink
//       };

//       fileLog.push(documentEntry);
//       fs.writeFileSync(logPath, JSON.stringify(fileLog, null, 2), 'utf-8');

//       return {
//         id: documentId,
//         signLink,
//         savedPath,
//         originalName: file.originalname
//       };
//     } catch (error) {
//       throw new Error('שגיאה בשמירת הקובץ: ' + error.message);
//     }
//   }

//   async embedSignatureToPdf(id, signatureBase64) {
//     try {
//       if (!fs.existsSync(logPath)) {
//         throw new Error('קובץ לוג לא קיים');
//       }

//       const logData = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
//       const fileEntry = logData.find(doc => doc.id === id);
//       if (!fileEntry) throw new Error('מסמך לא נמצא');

//       let inputPath = path.join(uploadsDir, fileEntry.savedName);

//       if (!fs.existsSync(inputPath)) {
//         throw new Error('קובץ המקור לא נמצא');
//       }

//       if (inputPath.endsWith('.docx')) {
//         const outputPath = inputPath.replace('.docx', '.pdf');
//         await this.convertDocxToPdf(inputPath, outputPath);
//         inputPath = outputPath;
//       }

//       const fileBuffer = fs.readFileSync(inputPath);
//       const pdfDoc = await PDFDocument.load(fileBuffer);

//       const base64Data = signatureBase64.split(',')[1];
//       const signatureImage = await pdfDoc.embedPng(Buffer.from(base64Data, 'base64'));

//       const page = pdfDoc.getPages()[0];
//       page.drawImage(signatureImage, {
//         x: 50,
//         y: 50,
//         width: 150,
//         height: 50,
//       });

//       const modifiedPdf = await pdfDoc.save();
//       fs.writeFileSync(inputPath, modifiedPdf);

//       return inputPath;
//     } catch (error) {
//       throw new Error('שגיאה בהטמעת החתימה: ' + error.message);
//     }
//   }

//   async addSignatureToPdf(pdfPath, signatureBase64, outputPath) {
//     try {
//       if (!fs.existsSync(pdfPath)) {
//         throw new Error('קובץ PDF לא נמצא');
//       }

//       const existingPdfBytes = fs.readFileSync(pdfPath);
//       const signatureImageBytes = Buffer.from(signatureBase64.split(",")[1], "base64");

//       const pdfDoc = await PDFDocument.load(existingPdfBytes);
//       const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
//       const firstPage = pdfDoc.getPages()[0];

//       firstPage.drawImage(signatureImage, {
//         x: 50,
//         y: 100,
//         width: 150,
//         height: 50,
//       });

//       const pdfBytes = await pdfDoc.save();
//       fs.writeFileSync(outputPath, pdfBytes);
//     } catch (error) {
//       throw new Error('שגיאה בהוספת חתימה ל־PDF: ' + error.message);
//     }
//   }

//   async convertDocxToPdf(inputPath, outputPath) {
//     return new Promise((resolve, reject) => {
//       try {
//         if (!fs.existsSync(inputPath)) {
//           return reject(new Error('קובץ DOCX לא נמצא'));
//         }

//         const ext = '.pdf';
//         const file = fs.readFileSync(inputPath);
//         libre.convert(file, ext, undefined, (err, done) => {
//           if (err) return reject(err);

//           fs.writeFileSync(outputPath, done);
//           resolve();
//         });
//       } catch (error) {
//         reject(new Error('שגיאה בהמרת DOCX ל־PDF: ' + error.message));
//       }
//     });
//   }

//   getFilePathById(id) {
//     try {
//       if (!fs.existsSync(logPath)) {
//         throw new Error('קובץ לוג לא קיים');
//       }

//       const logData = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
//       const fileEntry = logData.find(doc => doc.id === id);

//       if (!fileEntry) {
//         throw new Error('קובץ עם מזהה זה לא נמצא');
//       }

//       const fullPath = path.join(uploadsDir, fileEntry.savedName);
//       if (!fs.existsSync(fullPath)) {
//         throw new Error('קובץ פיזית לא קיים בשרת');
//       }

//       return fullPath;
//     } catch (error) {
//       throw new Error('שגיאה בשליפת נתיב הקובץ: ' + error.message);
//     }
//   }
// }

// module.exports = new Document_repository();

////////////////////////////////////////////////////////////////////////////////////////////

// // Document_repository.js
// const fs = require('fs');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');
// const { PDFDocument } = require('pdf-lib');
// const libre = require('libreoffice-convert');
// const nodemailer = require('nodemailer');

// const logPath = path.join(__dirname, '../uploads/files-log.json');
// const uploadsDir = path.join(__dirname, '../uploads');

// class Document_repository {
//   constructor() {}

//   async storeFile(file) {
//     try {
//       const savedPath = path.join('uploads', file.filename);
//       const logExists = fs.existsSync(logPath);
//       let fileLog = logExists ? JSON.parse(fs.readFileSync(logPath, 'utf-8')) : [];

//       const documentId = uuidv4();
//       const signLink = `http://localhost:3000/sign/${documentId}`;

//       const documentEntry = {
//         id: documentId,
//         originalName: file.originalname,
//         savedName: file.filename,
//         size: file.size,
//         mimetype: file.mimetype,
//         savedAt: new Date().toISOString(),
//         signLink
//       };

//       fileLog.push(documentEntry);
//       fs.writeFileSync(logPath, JSON.stringify(fileLog, null, 2), 'utf-8');

//       return {
//         id: documentId,
//         signLink,
//         savedPath,
//         originalName: file.originalname
//       };
//     } catch (error) {
//       throw new Error('שגיאה בשמירת הקובץ: ' + error.message);
//     }
//   }

//   getFilePathById(id) {

//     try {
//       if (!fs.existsSync(logPath)) {
//         throw new Error('קובץ לוג לא קיים');
//       }

//       const logData = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
//       const fileEntry = logData.find(doc => doc.id === id);


//       if (!fileEntry) {
//         throw new Error('קובץ עם מזהה זה לא נמצא');
//       }

//       const fullPath = path.join(uploadsDir, fileEntry.savedName);
//       if (!fs.existsSync(fullPath)) {
//         throw new Error('קובץ פיזית לא קיים בשרת');
//       }
//       return fullPath;
//     } catch (error) {
//       throw new Error('שגיאה בשליפת נתיב הקובץ: ' + error.message);
//     }
//   }

//   async convertDocxToPdf(inputPath, outputPath) {
//     return new Promise((resolve, reject) => {
//       try {
//         if (!fs.existsSync(inputPath)) {
//           return reject(new Error('קובץ DOCX לא נמצא'));
//         }

//         const ext = '.pdf';
//         const file = fs.readFileSync(inputPath);
//         libre.convert(file, ext, undefined, (err, done) => {
//           if (err) return reject(err);

//           fs.writeFileSync(outputPath, done);
//           resolve();
//         });
//       } catch (error) {
//         reject(new Error('שגיאה בהמרת DOCX ל־PDF: ' + error.message));
//       }
//     });
//   }

//   async embedSignatureToPdf(id, signatureBase64) {
//     try {
//       if (!fs.existsSync(logPath)) {
//         throw new Error('קובץ לוג לא קיים');
//       }

//       const logData = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
//       const fileEntry = logData.find(doc => doc.id === id);
//       if (!fileEntry) throw new Error('מסמך לא נמצא');

//       let inputPath = path.join(uploadsDir, fileEntry.savedName);

//       if (!fs.existsSync(inputPath)) {
//         throw new Error('קובץ המקור לא נמצא');
//       }

//       if (inputPath.endsWith('.docx')) {
//         const outputPath = inputPath.replace('.docx', '.pdf');
//         await this.convertDocxToPdf(inputPath, outputPath);
//         inputPath = outputPath;
//       }

//       const fileBuffer = fs.readFileSync(inputPath);
//       const pdfDoc = await PDFDocument.load(fileBuffer);
//       const base64Data = signatureBase64.split(',')[1];
//       const signatureImage = await pdfDoc.embedPng(Buffer.from(base64Data, 'base64'));

//       const page = pdfDoc.getPages()[0];
//       page.drawImage(signatureImage, {
//         x: 50,
//         y: 50,
//         width: 150,
//         height: 50,
//       });

//       const modifiedPdf = await pdfDoc.save();
//       fs.writeFileSync(inputPath, modifiedPdf);

//       return inputPath;
//     } catch (error) {
//       throw new Error('שגיאה בהטמעת החתימה: ' + error.message);
//     }
//   }

//   async applySignatureWithConversionAndMail(id, signatureBase64) {
//     try {
//       const inputPath = this.getFilePathById(id);

//       let finalPdfPath = inputPath;
//       if (inputPath.endsWith('.docx')) {
//         finalPdfPath = inputPath.replace('.docx', '.pdf');
//         await this.convertDocxToPdf(inputPath, finalPdfPath);
//       }

//       const signedPath = await this.embedSignatureToPdf(id, signatureBase64);
//       await this.sendSignedDocumentByEmail(signedPath);
//       return signedPath;
//     } catch (error) {
//       throw new Error('שגיאה בתהליך החתימה והשליחה: ' + error.message);
//     }
//   }

//   async sendSignedDocumentByEmail(filePath) {
//     try {
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: process.env.EMAIL_FROM,
//           pass: process.env.EMAIL_PASS,
//         },
//       });

//       const mailOptions = {
//         from: process.env.EMAIL_FROM,
//         to: process.env.EMAIL_TO,
//         subject: 'המסמך החתום שלך',
//         text: 'מצורף המסמך החתום כקובץ PDF.',
//         attachments: [
//           {
//             filename: path.basename(filePath),
//             path: filePath,
//           },
//         ],
//       };

//       await transporter.sendMail(mailOptions);
//     } catch (error) {
//       throw new Error('שגיאה בשליחת מייל עם המסמך: ' + error.message);
//     }
//   }

// async  getDocumentById(id) {
//   if (!fs.existsSync(logPath)) return null;

//   const data = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
//   return data.find(doc => doc.id === id) || null;
// }
// }

// module.exports = new Document_repository();


///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////


// Document_repository.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { PDFDocument, rgb } = require('pdf-lib');

const libre = require('libreoffice-convert');
const nodemailer = require('nodemailer');

const logPath = path.join(__dirname, '../uploads/files-log.json');
const uploadsDir = path.join(__dirname, '../uploads');

class Document_repository {
  constructor() { }
  async storeFile(file) {
    try {
      const originalPath = path.join(uploadsDir, file.filename);
      let finalSavedName = file.filename;
      let currentPath = originalPath;
      // אם זה DOCX, המר מיד ל־PDF
      if (file.filename.endsWith('.docx')) {
        const pdfFilename = file.filename.replace('.docx', '.pdf');
        const pdfPath = path.join(uploadsDir, pdfFilename);
        await this.convertDocxToPdf(originalPath, pdfPath);
        finalSavedName = pdfFilename;
        currentPath = pdfPath;

        // מחיקת ה־DOCX המקורי (לא חובה, רק אם לא צריך אותו)
        fs.unlinkSync(originalPath);
      }

      // קבלת סיומת הקובץ
      const fileExtension = path.extname(finalSavedName);

      // יצירת שם בטוח וייחודי
      const safeFilename = `${Date.now()}${fileExtension}`;

      // הנתיב החדש
      const savedPath = path.join('uploads', safeFilename);
      const absoluteSavedPath = path.join(__dirname, '..', savedPath);

      // שינוי שם הקובץ לקובץ הסופי הבטוח
      fs.renameSync(currentPath, absoluteSavedPath);

      // יצירת מזהה ולוג
      const documentId = uuidv4();
      const clientBaseUrl = process.env.CLIENT_BASE_URL;
      const signLink = `${clientBaseUrl}/sign/${documentId}`;
      // const signLink = `http://localhost:3000/sign/${documentId}`;
      const logExists = fs.existsSync(logPath);
      let fileLog = logExists ? JSON.parse(fs.readFileSync(logPath, 'utf-8')) : [];

      const documentEntry = {
        id: documentId,
        originalName: file.originalname,
        savedName: safeFilename,
        size: file.size,
        mimetype: file.mimetype,
        savedAt: new Date().toISOString(),
        signLink
      };

      fileLog.push(documentEntry);
      fs.writeFileSync(logPath, JSON.stringify(fileLog, null, 2), 'utf-8');

      return {
        id: documentId,
        signLink,
        savedPath,
        savedName: safeFilename,
      };
    } catch (error) {
      throw new Error('שגיאה בשמירת הקובץ: ' + error.message);
    }
  }

  //   async storeFile(file) {
  //     try {
  //       const originalPath = path.join(uploadsDir, file.filename);
  //       let finalSavedName = file.filename;

  //       // אם זה DOCX, המר מיד ל־PDF
  //       if (file.filename.endsWith('.docx')) {
  //         const pdfFilename = file.filename.replace('.docx', '.pdf');
  //         const pdfPath = path.join(uploadsDir, pdfFilename);
  //         await this.convertDocxToPdf(originalPath, pdfPath);
  //         finalSavedName = pdfFilename;

  //         // אופציונלי: מחיקת קובץ ה־DOCX
  //         // fs.unlinkSync(originalPath);
  //       }
  //  // קבלת סיומת הקובץ
  //     const fileExtension = path.extname(finalSavedName);

  //     // יצירת שם בטוח וייחודי (ללא תווים בעייתיים)
  //     const safeFilename = `${Date.now()}${fileExtension}`;

  //     // הנתיב שבו יישמר הקובץ
  //     const savedPath = path.join('uploads', safeFilename);


  //       // const savedPath = path.join('uploads', finalSavedName);
  //       const documentId = uuidv4();
  //       const signLink = `http://localhost:3000/sign/${documentId}`;
  // // העתקה של הקובץ לשם החדש
  //     fs.renameSync(file.path, path.join(__dirname, '..', savedPath));

  //       const logExists = fs.existsSync(logPath);
  //       let fileLog = logExists ? JSON.parse(fs.readFileSync(logPath, 'utf-8')) : [];
  // ///////////////

  //     // // המשך יצירת הלוג
  //     // const logExists = fs.existsSync(logPath);
  //     // let fileLog = logExists ? JSON.parse(fs.readFileSync(logPath, 'utf-8')) : [];

  //     // const documentId = uuidv4();
  //     // const signLink = `http://localhost:3000/sign/${documentId}`;

  //       const documentEntry = {
  //         id: documentId,
  //         originalName: file.originalname,
  //         savedName: finalSavedName,
  //         size: file.size,
  //         mimetype: file.mimetype,
  //         savedAt: new Date().toISOString(),
  //         signLink
  //       };

  //       fileLog.push(documentEntry);
  //       fs.writeFileSync(logPath, JSON.stringify(fileLog, null, 2), 'utf-8');

  //       return {
  //         id: documentId,
  //         signLink,
  //         savedPath,
  //         // originalName: file.originalname,
  //         savedName: finalSavedName,

  //       };
  //     } catch (error) {
  //       throw new Error('שגיאה בשמירת הקובץ: ' + error.message);
  //     }
  //   }

  getFilePathById(id) {
    try {
      if (!fs.existsSync(logPath)) {
        throw new Error('קובץ לוג לא קיים');
      }

      const logData = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
      const fileEntry = logData.find(doc => doc.id === id);

      if (!fileEntry) {
        throw new Error('קובץ עם מזהה זה לא נמצא');
      }

      const fullPath = path.join(uploadsDir, fileEntry.savedName);
      if (!fs.existsSync(fullPath)) {
        throw new Error('קובץ פיזית לא קיים בשרת');
      }
      return fullPath;
    } catch (error) {
      throw new Error('שגיאה בשליפת נתיב הקובץ: ' + error.message);
    }
  }

  async convertDocxToPdf(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(inputPath)) {
          return reject(new Error('קובץ DOCX לא נמצא'));
        }

        const ext = '.pdf';
        const file = fs.readFileSync(inputPath);
        libre.convert(file, ext, undefined, (err, done) => {
          if (err) return reject(err);

          fs.writeFileSync(outputPath, done);
          resolve();
        });
      } catch (error) {
        reject(new Error('שגיאה בהמרת DOCX ל־PDF: ' + error.message));
      }
    });
  }

  async embedSignatureToPdf(id, signatureBase64) {
    try {
      if (!fs.existsSync(logPath)) {
        throw new Error('קובץ לוג לא קיים');
      }

      const logData = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
      const fileEntry = logData.find(doc => doc.id === id);
      if (!fileEntry) throw new Error('מסמך לא נמצא');

      let inputPath = path.join(uploadsDir, fileEntry.savedName);

      if (!fs.existsSync(inputPath)) {
        throw new Error('קובץ המקור לא נמצא');
      }

      const fileBuffer = fs.readFileSync(inputPath);
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const base64Data = signatureBase64.split(',')[1];
      const signatureImage = await pdfDoc.embedPng(Buffer.from(base64Data, 'base64'));
      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      lastPage.drawRectangle({
        x: 50,
        y: 50,
        width: 150,
        height: 50,
        color: rgb(1, 1, 1), // צבע לבן
      });

      // ציור החתימה החדשה
      lastPage.drawImage(signatureImage, {
        x: 50,
        y: 50,
        width: 150,
        height: 50,
      });
      const modifiedPdf = await pdfDoc.save();
      fs.writeFileSync(inputPath, modifiedPdf);

      return inputPath;
    } catch (error) {
      throw new Error('שגיאה בהטמעת החתימה: ' + error.message);
    }
  }

  async applySignatureWithConversionAndMail(id, signatureBase64) {
    try {
      const inputPath = this.getFilePathById(id);
      const signedPath = await this.embedSignatureToPdf(id, signatureBase64);
      await this.sendSignedDocumentByEmail(signedPath);
      return signedPath;
    } catch (error) {
      throw new Error('שגיאה בתהליך החתימה והשליחה: ' + error.message);
    }
  }

  async sendSignedDocumentByEmail(filePath) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: 'המסמך החתום שלך',
        text: 'מצורף המסמך החתום כקובץ PDF.',
        attachments: [
          {
            filename: path.basename(filePath),
            path: filePath,
          },
        ],
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error('שגיאה בשליחת מייל עם המסמך: ' + error.message);
    }
  }

  async getDocumentById(id) {
    if (!fs.existsSync(logPath)) return null;
    const data = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
    return data.find(doc => doc.id === id) || null;
  }
}

module.exports = new Document_repository();
