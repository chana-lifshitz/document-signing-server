import axios from "axios";
const API = process.env.REACT_APP_API_BASE_URL;

export const uploadDocument = (file: File, email: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('email', email);
  return axios.post('/api/documents/upload', formData);
};

export function signDocument(id: string, signatureData: string, userEmail: string) {
  return axios.post(`/api/documents/sign/${id}`, {
    signatureData: signatureData,
    email: userEmail,
  }).then(res => res.data);
}

export function getDocumentById(id: string) {
  return axios.get(`/api/documents/${id}`);
}

