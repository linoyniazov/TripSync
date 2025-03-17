import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import ProfilePage from './pages/ProfilePage';
import UploadPost from './pages/UploadPost';
import AuthForm from "./components/auth/AuthForm";
import Registration from "./components/Registration"; // הו��פנו את הקו��פו��נ��ה של הרי��ו��


// import Registration from "./components/Registration"; // הוספנו את הקומפוננטה של הרישום
// import Login from './components/Login';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<AuthForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/uploadPost" element={<UploadPost />} />
          <Route path="/register" element={<Registration />} /> 
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
