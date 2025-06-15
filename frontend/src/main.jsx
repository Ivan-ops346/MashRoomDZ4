import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UnosForm from './pages/UnosForm.jsx';
import UnosiList from './pages/UnosiList.jsx';
import Home from './pages/Home.jsx';
import PregledZadataka from './pages/PregledZadataka.jsx';
import StartZadatak from './pages/Zadaci/StartZadatak.jsx';
import OdabirUloge  from './pages/Zadaci/OdabirUloge.jsx';
import UnosIskustva  from './pages/Zadaci/UnosIskustva.jsx';
import ProvjeraIskusni  from './pages/Zadaci/ProvjeraIskusni.jsx';
import UploadDokumenta from './pages/Zadaci/UploadDokumenta.jsx';
import ProvjeraPozadine from './pages/Zadaci/ProvjeraPozadine.jsx';
import ProvjeraDeterminator from './pages/Zadaci/ProvjeraDeterminator.jsx';
import PolaganjeIspita from './pages/Zadaci/PolaganjeIspita.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="unos" element={<UnosForm />} />
          <Route path="unosi/:id/uredi" element={<UnosForm />} />
          <Route path="unosi" element={<UnosiList />} />
          <Route path="start-zadatak" element={<StartZadatak />} />
          <Route path="pregledZadataka" element={<PregledZadataka />} />
          <Route path="zadaci/odabirUloge" element={<OdabirUloge />} />
          <Route path="zadaci/unosIskustva" element={<UnosIskustva />} />
          <Route path="zadaci/uploadDokumenta" element={<UploadDokumenta />} />
          <Route path="zadaci/provjeraIskusni" element={<ProvjeraIskusni />} />
          <Route path="zadaci/provjeraPozadine" element={<ProvjeraPozadine />} />
          <Route path="zadaci/provjeraDeterminator" element={<ProvjeraDeterminator />} />
          <Route path="zadaci/polaganjeIspita" element={<PolaganjeIspita />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
