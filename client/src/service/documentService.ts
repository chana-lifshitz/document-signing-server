import axios from "axios";

export function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);
return axios.post('/api/documents/upload', formData);
// return axios.post('http://localhost:2000/api/documents/upload', formData);

}

export function signDocument(id: string, signatureData: string) {
  return axios.post(`/api/documents/sign/${id}`, {
    signatureData
  }).then(res => res.data);
  // return axios.post(`http://localhost:2000/api/documents/sign/${id}`, {
  //   signatureData
  // }).then(res => res.data);
}


export function getDocumentById(id: string) {
  return axios.get(`/api/documents/${id}`);
    // return axios.get(`http://localhost:2000/api/documents/${id}`);

}

