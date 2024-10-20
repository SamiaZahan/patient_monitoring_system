import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';

import Login from './components/Auth/Login';
import Register from './components/Auth/Registration';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
import PatientDashboard from './components/Dashboard/PatientDashboard';
import StaffDashboard from './components/Dashboard/StaffDashboard';
import PatientDetail from './components/Dashboard/PatientDetail';
import DoctorProfile from './components/Dashboard/DoctorProfile'


function App() {
  return (
      <div className="App">
        <Router>
          {/* <Header></Header> */}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor-profile" element={<DoctorProfile />} />
                <Route path="/staff-dashboard" element={<StaffDashboard />} />
                <Route path="/patient-dashboard" element={<PatientDashboard />} />

                <Route path="/patient/:patientId" element={<PatientDetail />}/>
            </Routes>
        </Router>
      </div>
  );
}

export default App;
