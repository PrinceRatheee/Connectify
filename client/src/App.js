import {  Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';

import SignUp from './components/SignUp';
import { Toaster } from 'react-hot-toast';
import SignIn from './components/SignIn';


function App() {
  return (
    <div className='bg-[#e1edff] h-screen flex items-center justify-center'>

      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={
          
           
              <Dashboard />
           
         
        } />
        <Route path='/users/sign_in' element={
        
            <SignIn/>
          
          }/>
       
        <Route path='/users/sign_up' element={
        
            <SignUp/>
          
          }/>
      
      </Routes>
    </div>
  );
}

export default App;
