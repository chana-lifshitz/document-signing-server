import React from 'react';
import logo from './logo.svg';
import './App.css';
import Form from './components/Form/Form';
import SignPage from './components/SignPage/SignPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
<BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="Form" element={<Form />} />
        <Route path="sign/:id" element={<SignPage />} />
      </Routes>
    </BrowserRouter>    </div>
  );
}

export default App;
