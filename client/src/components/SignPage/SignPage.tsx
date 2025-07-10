// // import { useRef } from 'react';
// // import SignatureCanvas from 'react-signature-canvas';

// // function SignPage() {
// //   // const sigCanvasRef = useRef(null);
// // const sigCanvasRef = useRef<any>(null);

// // ////


// //   const handleSubmit = async () => {
// //     const signatureImage = sigCanvasRef.current?.getTrimmedCanvas().toDataURL("image/png");

// //     const res = await fetch("http://localhost:3000/upload", {
// //       method: "POST",
// //       body: JSON.stringify({ 
// //         id: "ה-id מה-URL", 
// //         signature: signatureImage 
// //       }),
// //       headers: {
// //         "Content-Type": "application/json"
// //       }
// //     });

// //     alert("תודה! המסמך נחתם ונשלח.");
// //   };

// //   return (
// //     <div>
// //       <h3>חתום על המסמך</h3>
// //       <SignatureCanvas 
// //         penColor="black" 
// //         canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} 
// //         ref={sigCanvasRef}
// //       />
// //       <button onClick={handleSubmit}>שלח חתימה</button>
// //     </div>
// //   );
// // }
// // export default SignPage;
// /////////////////////////////////////
// import { useRef } from 'react';
// import SignatureCanvas from 'react-signature-canvas';
// import { useParams } from 'react-router-dom';

// function SignPage() {
//   const sigCanvasRef = useRef<any>(null);
//   const { id } = useParams(); // שליפת ה־id מה-URL

//   const handleSubmit = async () => {
//     const signatureImage = sigCanvasRef.current?.getCanvas().toDataURL("image/png");
//     console.log("signatureImage:", signatureImage);

//     try {
//       const res = await fetch(`http://localhost:2000/api/documents/sign/${id}`, {
//         method: "POST",
//         body: JSON.stringify({
//           signatureData: signatureImage,
//         }),
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });

//       const data = await res.json();
//       if (res.ok) {
//         alert("המסמך נחתם ונשמר!");
//         console.log("Signed file saved at:", data.filePath);
//       } else {
//         console.error(data.error);
//         alert("שגיאה: " + data.error);
//       }

//     } catch (error) {
//       console.error('שגיאה בשליחה:', error);
//       alert("שגיאה בשליחה לשרת");
//     }
//   };

//   return (
//     <div>
//       <h3>חתום על המסמך</h3>
//       <SignatureCanvas
//         penColor="black"
//         canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
//         ref={sigCanvasRef}
//       />
//       <button onClick={handleSubmit}>שלח חתימה</button>
//     </div>
//   );
// }

// export default SignPage;


// /////////////////////////
// // import React, { useEffect, useRef, useState } from 'react';
// // import SignatureCanvas from 'react-signature-canvas';
// // import { useParams } from 'react-router-dom';
// // import './SignPage.scss';

// // const SignPage = () => {
// //   const { id } = useParams(); // מתוך /sign/:id
// //   const sigCanvasRef = useRef<SignatureCanvas>(null);
// //   const [documentUrl, setDocumentUrl] = useState<string | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   // שליפת נתוני המסמך לפי ID
// //   useEffect(() => {
// //     const fetchDocument = async () => {
// //       try {
// //         const res = await fetch(`http://localhost:2000/api/documents/${id}`);
// //         const data = await res.json();
// //         // נניח שהשרת מחזיר { fileUrl: "http://localhost:2000/uploads/xxx.docx" }
// //         setDocumentUrl(data.fileUrl);
// //       } catch (err) {
// //         console.error('שגיאה בשליפת המסמך:', err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchDocument();
// //   }, [id]);

// //   const handleSubmit = async () => {
// //     if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
// //       alert("אנא חתום לפני שליחה.");
// //       return;
// //     }

// //     const signatureImage = sigCanvasRef.current
// //       .getTrimmedCanvas()
// //       .toDataURL("image/png");
// //     const res = await fetch(`http://localhost:2000/api/documents/sign/${id}`, {
// //       method: "POST",
// //       body: JSON.stringify({
// //         signature: signatureImage,
// //       }),
// //       headers: {
// //         "Content-Type": "application/json"
// //       }
// //     });

// //     if (res.ok) {
// //       alert("המסמך נחתם ונשלח!");
// //     } else {
// //       alert("שגיאה בשליחת החתימה.");
// //     }
// //   };

// //   if (loading) return <p>טוען מסמך...</p>;

// //   return (
// //     <div className="SignPage">
// //       <h2>חתום על המסמך</h2>

// //       {documentUrl ? (
// //         <iframe
// //           src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(documentUrl)}`}
// //           width="100%"
// //           height="500px"
// //           frameBorder="0"
// //           title="Document Viewer"
// //         ></iframe>
// //       ) : (
// //         <p>לא נמצא מסמך להצגה.</p>
// //       )}

// //       <h3>חתימה דיגיטלית</h3>
// //       <div style={{ border: '1px solid black', width: 400, height: 200 }}>
// //         <SignatureCanvas
// //           ref={sigCanvasRef}
// //           penColor="black"
// //           canvasProps={{ width: 400, height: 200, className: 'sigCanvas' }}
// //         />
// //       </div>

// //       <button onClick={() => sigCanvasRef.current?.clear()}>נקה חתימה</button>
// //       <button onClick={handleSubmit}>שלח חתימה</button>
// //     </div>
// //   );
// // };

// // export default SignPage;

///////////////////////////////////////////////////////////////////////////
//////מסודר

// import React, { FC, useRef } from 'react';
// import SignatureCanvas from 'react-signature-canvas';
// import { useParams } from 'react-router-dom';
// import { signDocument } from '../../service/documentService';
// import './SignPage.scss';

// interface SignPageProps {}

// const SignPage: FC<SignPageProps> = () => {
//   const sigCanvasRef = useRef<SignatureCanvas | null>(null);

//   const { id } = useParams<{ id: string }>();

//   const handleSubmit = async () => {
//     if (!id) {
//       alert("לא נמצא מזהה מסמך ב־URL");
//       return;
//     }

//     // const signatureImage = sigCanvasRef.current?.getTrimmedCanvas().toDataURL("image/png");
//     const signatureImage = sigCanvasRef.current? sigCanvasRef.current.getCanvas().toDataURL("image/png"): "";

//     try {
//       const response = await signDocument(id, signatureImage || '');

//       alert("המסמך נחתם ונשמר!");
//       console.log("Signed file saved at:", response.filePath);
//     } catch (error: any) {
//       console.error('שגיאה:', error);
//       alert("שגיאה בשליחה: " + error.message);
//     }
//   };

//   return (
//     <div className="SignPage">
//       <h3>חתום על המסמך</h3>
//       <SignatureCanvas
//         penColor="black"
//         canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
//         ref={sigCanvasRef}
//       />
//       <button onClick={handleSubmit}>שלח חתימה</button>
//     </div>
//   );
// };

// export default SignPage;
//////////////////////////////////////////////////////////////////////


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
          console.log("savedName", savedName);
          console.log("res.data", res.data);
          const url = `/uploads/${savedName}`;
          // const url = `http://localhost:2000/uploads/${savedName}`;

          console.log("url", url);
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
      const response = await signDocument(id, signatureImage,email);
      alert("המסמך נחתם ונשמר!");
      console.log("Signed file saved at:", response.filePath);
          sigCanvasRef.current?.clear();
      const savedName = response.savedName;
      // רענון התצוגה
      setFileUrl(""); // שלב ראשון: נקה
      setTimeout(() => {
        const savedName = response.savedName || response.fileName || "unknown.pdf";
        // setFileUrl(`http://localhost:2000/uploads/${savedName}`);
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
      {/* <SignatureCanvas
        penColor="black"
        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
        ref={sigCanvasRef}
      /> */}<div className="signature-container">
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
