import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { Route,Routes } from 'react-router-dom';
import Home from './pages/Home';

const App = () => {
  const notify = () => toast("Wow so easy!");

    return (
      <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
      </div>
    );
}

export default App