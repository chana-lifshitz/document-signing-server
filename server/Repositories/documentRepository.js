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
      if (file.filename.endsWith('.docx')) {
        const pdfFilename = file.filename.replace('.docx', '.pdf');
        const pdfPath = path.join(uploadsDir, pdfFilename);
        await this.convertDocxToPdf(originalPath, pdfPath);
        finalSavedName = pdfFilename;
        currentPath = pdfPath;
        fs.unlinkSync(originalPath);
      }
      const fileExtension = path.extname(finalSavedName);
      const safeFilename = `${Date.now()}${fileExtension}`;
      const savedPath = path.join('uploads', safeFilename);
      const absoluteSavedPath = path.join(__dirname, '..', savedPath);
      fs.renameSync(currentPath, absoluteSavedPath);
      // יצירת מזהה ולוג
      const documentId = uuidv4();
      const clientBaseUrl = process.env.CLIENT_BASE_URL;
      const signLink = `${clientBaseUrl}/sign/${documentId}`;
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

  async applySignatureWithConversionAndMail(id, signatureBase64, email) {
    try {
      const inputPath = this.getFilePathById(id);
      const signedPath = await this.embedSignatureToPdf(id, signatureBase64);
      await this.sendSignedDocumentByEmail(signedPath, email);
      return signedPath;
    } catch (error) {
      throw new Error('שגיאה בתהליך החתימה והשליחה: ' + error.message);
    }
  }
  async sendSignedDocumentByEmail(filePath, userEmail) {
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
        to: [userEmail, process.env.EMAIL_TO], // שני נמענים
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
