import React, { FC, useState } from 'react';
import { uploadDocument } from '../../service/documentService';
import './Form.scss';

interface FormProps { }

const Form: FC<FormProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState<string>("");
  const [email, setEmail] = useState("");
const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setLink("");
  };

  const handleUpload = async () => {
    if (!file || !email) {
      alert("נא לבחור קובץ ולהזין כתובת מייל.");
      return;
    }
    localStorage.setItem("userEmail", email);
      setIsUploading(true); // ← התחלת טעינה
    try {
      const response = await uploadDocument(file, email);
      setLink(response.data.signLink);
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ:", error);
      alert("אירעה שגיאה בעת ההעלאה.");
    }
     finally {
    setIsUploading(false); // ← סיום טעינה
  }
  };
  return (
    <div className="Form">
      <h3>העלאת מסמך לחתימה</h3>
      <input type="file" onChange={handleFileChange} accept=".doc,.docx" />
      <input
        type="email"
        placeholder="הכנס מייל לקבלת מסמך חתום"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleUpload}>העלה מסמך</button>
      {isUploading && (
  <div className="loading">
    <span className="spinner"></span>
    <p>מעלה מסמך...</p>
  </div>
)}

      {link && (
        <p>
          קישור לחתימה:
          <br />
          <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
        </p>
      )}
    </div>
  );
};

export default Form;
