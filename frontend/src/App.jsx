import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import NgoRegistration from './pages/NgoRegistration';
import DonorRegistration from './pages/DonorRegistration';
import RiderRegistration from './pages/RiderRegistration';
import Login from './pages/Login';
import Role from './pages/Role';

const App = () => {
  const notify = () => toast("Wow so easy!");

    return (
      <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Registration-Ngo' element={<NgoRegistration/>}/>
        <Route path='/Registration-Donor' element={<DonorRegistration/>}/>
        <Route path='/Registration-Rider' element={<RiderRegistration/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Role' element={<Role/>}/>
      </Routes>
      </div>
    );
}

export default App