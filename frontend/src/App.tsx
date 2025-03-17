import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import ProfilePage from './pages/ProfilePage';
import UploadPost from './pages/UploadPost';
import TravelAIPage from './pages/TravelAIPage';
import Registration from "./components/Registration"; // הוספנו את הקומפוננטה של הרישום
import AuthForm from "./components/auth/AuthForm";
; // הו��פנו את הקו��פו��נ��ה של הרי��ו��



import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>

          <Route path="/register" element={<Registration />} /> 
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/uploadPost" element={<UploadPost />} />
          <Route path="/travel-ai" element={<TravelAIPage />} />

          <Route path="/" element={<AuthForm />} />
          <Route path="/home" element={<HomePage />} />
          

        </Route>
      </Routes>
    </Router>
  );
}

export default App;