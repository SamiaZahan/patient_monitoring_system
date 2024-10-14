import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import PastOrders from './components/PastOrders/PastOrders';

import Login from './components/Auth/Login';
import Register from './components/Auth/Registration';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
import PatientDetail from './components/Dashboard/PatientDetail';


function App() {
  return (
      <div className="App">
        <Router>
          {/* <Header></Header> */}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/patient/:patientId" element={<PatientDetail />}/>

                <Route path="/home" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/past-orders" element={<PastOrders />} />
            </Routes>
        </Router>
      </div>
  );
}

export default App;
