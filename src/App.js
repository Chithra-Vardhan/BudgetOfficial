
import './App.css';
import Nform from './MyComponentsOld/Nform';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './MyComponentsOld/Login';
import Home from './MyComponents/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import OkExpense from './MyComponents/OkExpense';
import OkIncome from './MyComponents/OkIncome';





function App() {
  const location = useLocation()
  return (
    <>
      {/* <NewNav/> */}
      <ToastContainer />

      {location.pathname == '/' && <Login />}

      <Routes>
        <Route exact path="/signup" element={<Nform/>} />
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/home" element={<Home />} />
        {/* <Route exact path="/main" element={<MainTracking />} /> */}
        <Route exact path="/OkIncome" element={<OkIncome />} />
        <Route exact path="/OkExpense" element={<OkExpense />} />
      </Routes>

    </>
  );
}

export default App;
