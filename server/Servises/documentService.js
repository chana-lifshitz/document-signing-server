// // const documentRepository = require('../Repositories/documentRepository');
// // class Document_service {
// //     constructor() {}
// //   async saveFile(file) {
// //   if (!file) throw new Error('לא התקבל קובץ');
// //   return await documentRepository.storeFile(file);
// // };

// //   async applySignature(id, signatureData) {
// //     if (!signatureData) throw new Error('לא התקבלה חתימה');
// //     return await documentRepository.embedSignatureToPdf(id, signatureData);
// //   }

// // }

// // module.exports = new Document_service();

// //  טוב עד השלב של המייל 

// // const documentRepository = require('../Repositories/documentRepository');
// // const libre = require('libreoffice-convert');
// // const fs = require('fs');
// // const path = require('path');
// // class Document_service {
// //   constructor() {}

// //   async saveFile(file) {
// //     if (!file) throw new Error('לא התקבל קובץ');
// //     return await documentRepository.storeFile(file);
// //   }

// //   // פונקציה פרטית להמרת DOCX ל-PDF
// //   async convertDocxToPdf(docxPath, pdfPath) {
// //     const ext = '.pdf';
// //     const file = fs.readFileSync(docxPath);

// //     return new Promise((resolve, reject) => {
// //       libre.convert(file, ext, undefined, (err, done) => {
// //         if (err) return reject(err);

// //         fs.writeFileSync(pdfPath, done);
// //         resolve();
// //       });
// //     });
// //   }

// // //   async applySignature(id, signatureData) {
// // //     if (!signatureData) throw new Error('לא התקבלה חתימה');

// // //     // השגה של הקובץ DOCX (מקורי)
// // //     const docxPath = documentRepository.getFilePathById(id); // הנחה שיש פונקציה כזו או כתבי בעצמך איך להשיג נתיב
// // //     if (!docxPath) throw new Error('קובץ לא נמצא');

// // //     // נתיב PDF זמני (אפשר לשנות לפי הצורך)
// // //     const pdfPath = docxPath.replace('.docx', '.pdf');

// // //     // המרת DOCX ל-PDF
// // //     await this.convertDocxToPdf(docxPath, pdfPath);

// // //     // עכשיו מבצעים הטמעת חתימה על קובץ ה-PDF
// // //     return await documentRepository.embedSignatureToPdf(id, signatureData);

// // //     // return await documentRepository.embedSignatureToPdf(pdfPath, signatureData);
// // //   }
// // async applySignature(id, signatureBase64) {
// //   const filePath = documentRepository.getFilePathById(id);

// //   // אם זה DOCX – המר קודם ל־PDF
// //   if (filePath.endsWith('.docx')) {
// //     const outputPath = filePath.replace('.docx', '.pdf');
// //     await documentRepository.convertDocxToPdf(filePath, outputPath);
// //     return await documentRepository.embedSignatureToPdf(id, signatureBase64); // משתמש ב-id, הפונקציה תמצא את ה־pdf
// //   } else {
// //     return await documentRepository.embedSignatureToPdf(id, signatureBase64);
// //   }
// // }

// // }

// // module.exports = new Document_service();


// const fs = require('fs');
// const path = require('path');
// const libre = require('libreoffice-convert');
// const nodemailer = require('nodemailer');
// const documentRepository = require('../Repositories/documentRepository');

// class Document_service {
//   constructor() {}

//   async saveFile(file) {
//     if (!file) throw new Error('לא התקבל קובץ');
//     return await documentRepository.storeFile(file);
//   }

//   async convertDocxToPdf(docxPath, pdfPath) {
//     const ext = '.pdf';
//     const file = fs.readFileSync(docxPath);

//     return new Promise((resolve, reject) => {
//       libre.convert(file, ext, undefined, (err, done) => {
//         if (err) return reject(err);
//         fs.writeFileSync(pdfPath, done);
//         resolve();
//       });
//     });
//   }

//   async applySignature(id, signatureBase64) {
//     const filePath = documentRepository.getFilePathById(id);
//     if (!filePath) throw new Error('לא נמצא קובץ עם מזהה זה');

//     let pdfPath;

//     // המרה ל-PDF אם זה DOCX
//     if (filePath.endsWith('.docx')) {
//       pdfPath = filePath.replace('.docx', '.pdf');
//       await this.convertDocxToPdf(filePath, pdfPath);
//     } else {
//       pdfPath = filePath;
//     }

//     // הטמעת חתימה על PDF

// const signedPdfPath = await documentRepository.embedSignatureToPdf(id, signatureBase64);

//     // שליחת קובץ החתום למייל
//     await this.sendSignedDocumentByEmail(signedPdfPath);

//     return signedPdfPath;
//   }

//   async sendSignedDocumentByEmail(filePath) {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_FROM,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_FROM,
//       to: process.env.EMAIL_TO,
//       subject: 'המסמך החתום שלך',
//       text: 'מצורף המסמך החתום כקובץ PDF.',
//       attachments: [
//         {
//           filename: path.basename(filePath),
//           path: filePath,
//         },
//       ],
//     };

//     await transporter.sendMail(mailOptions);
//   }
// }

// module.exports = new Document_service();
////////////////////////////////////////////////////////////////////////////////

// Document_service.js
const documentRepository = require('../Repositories/documentRepository');

class Document_service {
  constructor() { }

  async saveFile(file) {
    if (!file) throw new Error('לא התקבל קובץ');
    return await documentRepository.storeFile(file);
  }

  async applySignature(id, signatureBase64,email) {
    if (!id || !signatureBase64) throw new Error('פרטים חסרים לחתימה');
    return await documentRepository.applySignatureWithConversionAndMail(id, signatureBase64,email);
  }

  async convertDocxToPdf(docxPath, pdfPath) {
    return await documentRepository.convertDocxToPdf(docxPath, pdfPath);
  }

  async sendSignedDocumentByEmail(filePath) {
    return await documentRepository.sendSignedDocumentByEmail(filePath);
  }
  async getDocumentById(id) {
    if (!id) throw new Error('לא סופק מזהה מסמך');
    return await documentRepository.getDocumentById(id);
  }

}

module.exports = new Document_service();

