import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";

import Pets from "./pages/Pets.jsx";
import Consultations from "./pages/Consultations.jsx";
import Veterinarians from "./pages/Veterinarians.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Shop from "./pages/Shop.jsx";


function ProtectedRoute({ element }) {
  const isAuthenticated = false; // Logica de autenticação
  return isAuthenticated ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Routes element={<ProtectedRoute />}>
        <Route path="/pets" element={<Pets />} />
        <Route path="/consultas" element={<Consultations />} />
        <Route path="/veterinarios" element={<Veterinarians />} />
        <Route path="/perfil" element={<UserProfile />} />
        <Route path="/loja" element={<Shop />} />
      </Routes>
    </Router>
  );
}

export default App;
