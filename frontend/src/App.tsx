import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import ProfilePage from './pages/ProfilePage';
import UploadPost from './pages/UploadPost';
import TravelAIPage from './pages/TravelAIPage';
import Registration from "./components/Registration"; // הוספנו את הקומפוננטה של הרישום

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>

          <Route path="/register" element={<Registration />} /> {/* הוספנו את עמוד הרישום */}
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/uploadPost" element={<UploadPost />} />
          <Route path="/travel-ai" element={<TravelAIPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;