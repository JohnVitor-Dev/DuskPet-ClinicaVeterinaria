import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";

import Pets from "./pages/Pets.jsx";
import Consultations from "./pages/Consultations.jsx";
import Veterinarians from "./pages/Veterinarians.jsx";
import UserProfile from "./pages/UserProfile.jsx";


function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/pets" element={<ProtectedRoute><Pets /></ProtectedRoute>} />
        <Route path="/consultas" element={<ProtectedRoute><Consultations /></ProtectedRoute>} />
        <Route path="/veterinarios" element={<ProtectedRoute><Veterinarians /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
