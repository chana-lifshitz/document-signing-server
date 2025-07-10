// interface FormProps {}

// const Form: FC<FormProps> = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [step, setStep] = useState<'upload' | 'sign' | 'done'>('upload');
//   const sigCanvas = useRef<SignatureCanvas>(null);
//   const [signedData, setSignedData] = useState<string | null>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFile(e.target.files[0]);
//       console.log('Selected file:', e.target.files[0]);
//     }
//   };

//   const handleNext = () => {
//     if (!file) {
//       alert('אנא בחרי קובץ לפני המשך');
//       return;
//     }
//     setStep('sign');
//   };

//   const clearSignature = () => {
//     sigCanvas.current?.clear();
//     setSignedData(null);
//   };

//   const saveSignature = () => {
//     if (sigCanvas.current?.isEmpty()) {
//       alert('אנא חתום לפני שמירה');
//       return;
//     }
//     const dataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png') || null;
//     setSignedData(dataUrl);
//   };

//   const handleSubmit = () => {
//     if (!signedData) {
//       alert('אנא חתום על המסמך לפני שליחה');
//       return;
//     }

//     // כאן תוסיף את הלוגיקה להעלאת הקובץ והחתימה לשרת (כמו FormData למשל)
//     // לדוגמה:
//     /*
//     const formData = new FormData();
//     formData.append('file', file!);
//     formData.append('signature', signedData!);
//     // שלח ב fetch/axios
//     */

//     alert(`הקובץ ${file?.name} והחתימה נשלחו בהצלחה!`);
//     setStep('done');
//   };

//   if (step === 'upload') {
//     return (
//       <div className="Form">
//         <h2>העלאת קובץ Word</h2>
//         <input
//           type="file"
//           accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//           onChange={handleFileChange}
//         />
//         {file && <p>נבחר קובץ: {file.name}</p>}
//         <button onClick={handleNext}>המשך לחתימה</button>
//       </div>
//     );
//   }

//   if (step === 'sign') {
//     return (
//       <div className="Form">
//         <h2>חתום על המסמך</h2>
//         <div style={{ border: '1px solid black', width: 400, height: 200 }}>
//           <SignatureCanvas
//             ref={sigCanvas}
//             penColor="black"
//             canvasProps={{ width: 400, height: 200, className: 'sigCanvas' }}
//           />
//         </div>
//         <button onClick={clearSignature}>נקה חתימה</button>
//         <button onClick={saveSignature}>שמור חתימה</button>
//         {signedData && (
//           <div>
//             <h3>חתימה שנשמרה:</h3>
//             <img src={signedData} alt="חתימה" style={{ border: '1px solid #ccc' }} />
//           </div>
//         )}
//         <button onClick={handleSubmit}>שלח מסמך וחתימה</button>
//       </div>
//     );
//   }

//   return (
//     <div className="Form">
//       <h2>תודה! המסמך והחתימה התקבלו.</h2>
//     </div>
//   );
// };
/////////////////////////////////////////////////////
// function Form() {
//   const [file, setFile] = useState<File | null>(null);
// const [link, setLink] = useState<string>("");

// const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   setFile(e.target.files?.[0] || null);
// };

// const handleUpload = async () => {
//   if (!file) {
//     alert("יש לבחור קובץ לפני העלאה.");
//     return;
//   }
// else{
//   const formData = new FormData();
// formData.append('file', file);

//   const res = await fetch("http://localhost:2000/api/documents/upload", {
//     method: "POST",
//     body: formData,
//   });
// console.log("ffff");

//   const data = await res.json();
//   setLink(data.shareableLink);
//   }


// };


//   // const handleUpload = async () => {
//   //   const formData = new FormData();
//   //   formData.append("file", file);

//   //   const res = await fetch("http://localhost:3000/upload", {
//   //     method: "POST",
//   //     body: formData,
//   //   });
//   //   const data = await res.json();
//   //   setLink(data.shareableLink);
//   // };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} accept=".docx" />
//       <button onClick={handleUpload}>העלה מסמך</button>
//       {link && <p>העתק קישור לחתימה: <a href={link}>{link}</a></p>}
//     </div>
//   );
// }

// export default Form;


/////////////////////////////////////////////////////////////

// const [link, setLink] = useState<string>("");

// const handleUpload = async () => {
//   if (!file) return alert("בחרי קובץ קודם");

//   const formData = new FormData();
//   formData.append("file", file);

//   const res = await fetch("http://localhost:3000/upload", {
//     method: "POST",
//     body: formData,
//   });

//   const data = await res.json();
//   setLink(data.shareableLink);
// };

//  <div>
//     <h2>העלאת מסמך לחתימה</h2>
//     <input type="file" accept=".doc,.docx" onChange={handleFileChange} />
//     <button onClick={handleUpload}>העלה</button>
//     {link && (
//       <p>
//         קישור לחתימה:
//         <br />
//         <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
//       </p>
//     )}
//   </div>
// import React, { FC, useState, useRef } from 'react';
// import SignatureCanvas from 'react-signature-canvas';
// import './Form.scss';

// function Form() {
//   const [file, setFile] = useState<File | null>(null);
//   const [link, setLink] = useState<string>("");

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFile(e.target.files?.[0] || null);
//     setLink(""); // איפוס הלינק אם בוחרים קובץ חדש
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("יש לבחור קובץ לפני העלאה.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("http://localhost:2000/api/documents/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         throw new Error("העלאה נכשלה");
//       }

//       const data = await res.json();
//       console.log("data",data);

//       setLink(data.signLink); // כאן מקבלים את הלינק מהשרת
//     } catch (error) {
//       console.error("שגיאה בהעלאת הקובץ:", error);
//       alert("אירעה שגיאה בעת ההעלאה.");
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} accept=".doc,.docx" />
//       <button onClick={handleUpload}>העלה מסמך</button>
//       {link && (
//         <p>
//           העתק קישור לחתימה: <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
//         </p>
//       )}
//     </div>
//   );
// }

// export default Form;

// components/Form.tsx

import React, { FC, useState } from 'react';
import { uploadDocument } from '../../service/documentService';
import './Form.scss';

interface FormProps { }

const Form: FC<FormProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState<string>("");
  const [email, setEmail] = useState("");


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setLink("");
  };

  const handleUpload = async () => {
    // if (!file) {
    //   alert("יש לבחור קובץ לפני העלאה.");
    //   return;
    // }
 if (!file || !email) {
      alert("נא לבחור קובץ ולהזין כתובת מייל.");
      return;
    }
localStorage.setItem("userEmail", email);

    // const formData = new FormData();
    // formData.append("file", file);
    // formData.append("email", email);

    
  
  //   try {
  //     const response = await uploadDocument(formData);
  //     setLink(response.data.signLink);
  //   } catch (error) {
  //     console.error("שגיאה בהעלאת הקובץ:", error);
  //     alert("אירעה שגיאה בעת ההעלאה.");
  //   }
  // };
    try {

      const response = await uploadDocument(file, email);
      setLink(response.data.signLink);
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ:", error);
      alert("אירעה שגיאה בעת ההעלאה.");
    }
  };
 
  return (
    <div className="Form">
      <h3>העלאת מסמכים לחתימה</h3>
      <input type="file" onChange={handleFileChange} accept=".doc,.docx" />
      <input
        type="email"
        placeholder="הכנס מייל לקבלת מסמך חתום"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleUpload}>העלה מסמך</button>
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
