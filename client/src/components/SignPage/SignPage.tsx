import React, { FC, useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useParams } from 'react-router-dom';
import { signDocument, getDocumentById } from '../../service/documentService';
import './SignPage.scss';
import { Document, Page } from 'react-pdf';

interface SignPageProps { }

const SignPage: FC<SignPageProps> = () => {
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const { id } = useParams<{ id: string }>();
  const [fileUrl, setFileUrl] = useState<string>("");

  useEffect(() => {
    if (id) {
      getDocumentById(id)
        .then((res) => {
          const savedName = res.data.savedName;
          const url = `/uploads/${savedName}`;
          setFileUrl(url);
        })
        .catch((err) => {
          console.error("שגיאה בקבלת פרטי המסמך", err);
        });
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!id) {
      alert("לא נמצא מזהה מסמך ב־URL");
      return;
    }

    const signatureImage = sigCanvasRef.current?.getCanvas().toDataURL("image/png") || "";
    const email = localStorage.getItem("userEmail") || "";

    try {
      const response = await signDocument(id, signatureImage, email);
      alert("המסמך נחתם ונשמר!");
      console.log("Signed file saved at:", response.filePath);
      sigCanvasRef.current?.clear();
      const savedName = response.savedName;
      setFileUrl("");
      setTimeout(() => {
        const savedName = response.savedName || response.fileName || "unknown.pdf";
        setFileUrl(`/uploads/${savedName}`);
      }, 100);
    } catch (error: any) {
      console.error('שגיאה:', error);
      alert("שגיאה בשליחה: " + error.message);
    }
  };

  return (
    <div className="SignPage">
      <h3>חתום על המסמך</h3>
      {fileUrl && (
        <iframe
          src={fileUrl}
          width="100%"
          height="600px"
          title="PDF Viewer"
          key={fileUrl}
        />
      )}
      <div className="signature-container">
        <div className="signature-box">
          <p className="signature-label">חתום כאן</p>
          <SignatureCanvas
            penColor="black"
            canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
            ref={sigCanvasRef}
          />
        </div>
      </div>
      <button onClick={handleSubmit}>שלח חתימה</button>
      <button onClick={() => sigCanvasRef.current?.clear()}>נקה חתימה</button>
    </div>
  );
};


export default SignPage;
