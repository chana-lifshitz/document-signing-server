const documentRepository = require('../Repositories/documentRepository');

class Document_service {
  constructor() { }

  async saveFile(file) {
    if (!file) throw new Error('לא התקבל קובץ');
    return await documentRepository.savingDocument(file);
  }

  async applySignature(id, signatureBase64, email) {
    if (!id || !signatureBase64) throw new Error('פרטים חסרים לחתימה');
    return await documentRepository.applySignatureWithConversionAndMail(id, signatureBase64, email);
  }

  async getDocumentById(id) {
    if (!id) throw new Error('לא סופק מזהה מסמך');
    return await documentRepository.getDocumentById(id);
  }

}

module.exports = new Document_service();

